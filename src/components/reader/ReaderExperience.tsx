"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "./reader-pdf.css";
import { READER_DEFAULT_TITLE } from "./readerConstants";
import type { ComicReaderData } from "@/src/data/comicReaderData";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type SidebarItem = { id: string; page: number; label: string; title: string; blurb: string };

const CHAPTERS: SidebarItem[] = [
  { id: "c1", page: 1, label: "01", title: "Cold Open", blurb: "Gotham skyline — tone and stakes." },
  { id: "c2", page: 4, label: "02", title: "Neon Alley", blurb: "First confrontation in the rain." },
  { id: "c3", page: 12, label: "03", title: "Signal Run", blurb: "Chase sequence across rooftops." },
  { id: "c4", page: 22, label: "04", title: "Clocktower", blurb: "Briefing before the finale." },
];

const SPECS: { k: string; v: string }[] = [
  { k: "Format", v: "Digital · Print-ready" },
  { k: "Dimensions", v: "6.625 × 10.25 in" },
  { k: "Color profile", v: "CMYK / Screen RGB" },
  { k: "Published", v: "2026 · TagComics" },
];

const TAGS = ["Noir", "Urban", "Sci-Fi", "Crime"];
const MAX_PREVIEW_PAGES = 1;

function fileUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

const readerBarRoundBtn = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition select-none hover:border-brand/40 hover:bg-brand/20 hover:text-brand focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97] disabled:pointer-events-none disabled:opacity-35 disabled:hover:border-white/15 disabled:hover:bg-white/10 disabled:hover:text-white";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.035;
const PDF_WH_RATIO_FALLBACK = 0.648;

function PdfDocumentSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-16" aria-busy="true" aria-label="Loading PDF">
      <div className="h-2 w-full max-w-[12rem] animate-pulse rounded-full bg-white/10" />
      <div className="aspect-[2/3] w-full max-w-[min(88vw,420px)] animate-pulse rounded-lg bg-white/5 shadow-inner ring-1 ring-white/10" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Loading PDF…</p>
    </div>
  );
}

function PdfPageSkeleton({ width }: { width: number }) {
  const minH = Math.max(200, Math.round(width / PDF_WH_RATIO_FALLBACK));
  return (
    <div style={{ width, minHeight: minH }} className="flex flex-col gap-2 rounded-sm border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur-sm" aria-hidden>
      <div className="min-h-[58%] w-full flex-1 animate-pulse rounded bg-white/5" />
      <div className="h-2 w-[80%] animate-pulse rounded bg-white/5" />
      <div className="h-2 w-[55%] animate-pulse rounded bg-white/5" />
    </div>
  );
}

export interface ReaderExperienceProps {
  comicData?: ComicReaderData;
  pdfPath?: string;
  title?: string;
  subtitle?: string;
  coverImage?: string;
}

function LockedScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand/30 bg-brand/10 mx-auto">
          <i className="fa-solid fa-lock text-2xl text-brand" />
        </div>
        <h2 className="text-xl font-black text-white">Unlock Full Comic</h2>
        <p className="mt-3 text-sm text-zinc-400">Purchase the full PDF version to continue reading and download your copy.</p>
        <div className="mt-8 flex flex-col gap-3">
          <button type="button" className="w-full rounded-lg border border-brand/40 bg-brand/20 px-6 py-3 text-sm font-bold text-brand transition hover:bg-brand/30 hover:border-brand/60">
            <i className="fa-solid fa-cart-shopping mr-2" />Purchase PDF
          </button>
          <button type="button" onClick={onBack} className="w-full rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white">
            Back to Comics
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReaderExperience({ comicData, pdfPath, title = READER_DEFAULT_TITLE, subtitle, coverImage }: ReaderExperienceProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const [fitBox, setFitBox] = useState({ w: 880, h: 560 });
  const [pdfPageDim, setPdfPageDim] = useState<{ w: number; h: number } | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(CHAPTERS[0]!.id);
  const [isPurchased] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const pdfViewportRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const effectivePdfPath = comicData?.pdfUrl || pdfPath;
  const singlePreviewPage = comicData?.coverImage || coverImage;
  const previewPages = comicData?.previewPages || (singlePreviewPage ? [singlePreviewPage, singlePreviewPage] : []);
  const hasPreview = previewPages.length > 0;
  const isPreviewMode = !isPurchased;
  const maxPreview = MAX_PREVIEW_PAGES;

  const sidebarItems = useMemo<SidebarItem[]>(() => {
    return CHAPTERS;
  }, []);

  const clampedZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));
  const pageFitWidth = useMemo(() => {
    const padX = 24;
    const padY = 20;
    const maxW = Math.max(200, fitBox.w - padX);
    const maxH = Math.max(200, fitBox.h - padY);
    if (pdfPageDim && pdfPageDim.h > 0 && pdfPageDim.w > 0) {
      const { w: pw, h: ph } = pdfPageDim;
      const fitW = Math.min(maxW, (maxH * pw) / ph);
      return Math.max(120, Math.round(fitW));
    }
    const estFromHeight = maxH * PDF_WH_RATIO_FALLBACK;
    return Math.max(120, Math.round(Math.min(maxW, estFromHeight)));
  }, [fitBox.w, fitBox.h, pdfPageDim]);

  const safeCurrentPage = useMemo(() => numPages ? Math.min(Math.max(currentPage, 1), numPages) : 1, [numPages, currentPage]);

  const activeChapterIndex = useMemo(() => {
    const idx = CHAPTERS.findIndex((c) => c.id === activeChapterId);
    return idx >= 0 ? idx : 0;
  }, [activeChapterId]);

  const goBackInReadingOrder = useCallback(() => {
    if (isPreviewMode) {
      if (showLocked) {
        setShowLocked(false);
        setPreviewIndex(Math.max(0, maxPreview - 1));
      } else {
        setPreviewIndex((p) => Math.max(0, p - 1));
      }
    }
    else if (numPages) setCurrentPage((p) => Math.max(1, p - 1));
  }, [isPreviewMode, numPages, showLocked, maxPreview]);

  const goForwardInReadingOrder = useCallback(() => {
    if (isPreviewMode) {
      if (previewIndex >= MAX_PREVIEW_PAGES - 1) setShowLocked(true);
      else setPreviewIndex((p) => p + 1);
    } else if (numPages) setCurrentPage((p) => Math.min(numPages, p + 1));
  }, [isPreviewMode, previewIndex, numPages]);

  useLayoutEffect(() => {
    const el = pdfViewportRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w < 64 || h < 64) return;
        setFitBox({ w: Math.max(200, w), h: Math.max(200, h) });
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  useEffect(() => {
    if (effectivePdfPath) {
      const href = fileUrl(effectivePdfPath);
      if (typeof document === "undefined") return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = "fetch";
      document.head.appendChild(link);
      return () => { if (link.parentNode) link.parentNode.removeChild(link); };
    }
  }, [effectivePdfPath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goBackInReadingOrder(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goForwardInReadingOrder(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBackInReadingOrder, goForwardInReadingOrder]);

  useLayoutEffect(() => {
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.backgroundColor = "#000";
    document.body.style.backgroundColor = "#000";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg;
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const onDocumentLoad = useCallback(({ numPages: n }: { numPages: number }) => {
    setLoadError(null);
    setPdfPageDim(null);
    setNumPages(n);
    setCurrentPage(1);
    setZoom(ZOOM_MAX);
  }, []);

  const file = useMemo(() => effectivePdfPath ? fileUrl(effectivePdfPath) : null, [effectivePdfPath]);
  const canDownload = !!effectivePdfPath && isPurchased;
  const handleBackToComics = () => router.push("/");

  useEffect(() => {
    if (comicData?.coverImage) {
      console.log("Reader received cover:", comicData.coverImage);
    }
  }, [comicData?.coverImage]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/80">
        <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-white">← Back</Link>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-xs font-black uppercase tracking-[0.14em] text-white sm:text-sm">{title}</h1>
            {subtitle ? <p className="truncate text-[10px] text-zinc-400">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canDownload ? (
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-brand/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-brand backdrop-blur-sm transition hover:border-brand/50 hover:bg-brand/30 sm:px-4 sm:text-[11px]">
                <i className="fa-solid fa-download text-[11px]" aria-hidden />Download PDF
              </button>
            ) : (
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-brand backdrop-blur-sm transition hover:border-brand/50 hover:bg-black/60 sm:px-4 sm:text-[11px]">
                <i className="fa-solid fa-cart-shopping text-[11px]" aria-hidden />Purchase
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1920px] flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="hidden w-[min(100%,260px)] shrink-0 border-white/10 bg-black/50 backdrop-blur-2xl lg:block lg:border-r">
          <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto p-5">
            <p className="font-serif text-xl font-semibold text-white">Contents</p>
            <p className="mt-1 text-xs text-zinc-400">{isPreviewMode ? "Preview — tap to jump." : "Chapters — tap to jump."}</p>
            <div className="mt-6 space-y-1 border-t border-white/10 pt-5">
              {sidebarItems.map((item, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button key={item.id} type="button" onClick={() => {
                    if (isPreviewMode) {
                      setShowLocked(true);
                    } else if (numPages) { setCurrentPage(Math.min(item.page, numPages)); setActiveChapterId(item.id); }
                  }} className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition ${isActive ? "border-brand/45 bg-brand/10 shadow-[0_0_20px_rgba(88,232,193,0.12)]" : "border-transparent hover:border-white/10 hover:bg-white/5"}`}>
                    <div className="flex justify-between gap-2 text-[10px] text-zinc-400">
                      <span className="font-bold text-zinc-300">{item.label}</span>
                      <span>Pg. {String(item.page).padStart(3, "0")}</span>
                    </div>
                    <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-zinc-300"}`}>{item.title}</span>
                    <span className="text-[11px] leading-snug text-zinc-500">{item.blurb}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-xs font-semibold text-zinc-400">
              <button type="button" className="transition hover:text-white" onClick={goBackInReadingOrder}>← Back</button>
              <div className="flex gap-1.5" aria-hidden>
                {sidebarItems.map((_, i) => (<span key={i} className={`h-1.5 w-1.5 rounded-full ${i === activeChapterIndex ? "bg-brand" : "bg-white/20"}`} />))}
              </div>
              <button type="button" className="transition hover:text-white" onClick={goForwardInReadingOrder}>Forward →</button>
            </div>
          </div>
        </aside>

        <main id="reader-stage" className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-black/80 backdrop-blur-md lg:min-h-[calc(100dvh-3.5rem)]">
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-28 pt-6 sm:px-10 sm:pb-32">
            <button type="button" onClick={() => setTocOpen(true)} className="mb-4 flex shrink-0 flex-col items-center gap-1 text-zinc-400 transition hover:text-white lg:hidden">
              <i className="fa-solid fa-book-open text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
            </button>

            <div ref={pdfViewportRef} className="flex min-h-[50dvh] w-full flex-1 flex-col items-center justify-center overflow-hidden sm:min-h-[56dvh]">
              {showLocked ? (
                <LockedScreen onBack={handleBackToComics} />
              ) : isPreviewMode ? (
                hasPreview ? (
                  <div className="reader-pdf relative flex w-full max-w-full items-center justify-center overflow-hidden">
                    <div className="rounded-sm border border-white/10 bg-white/10 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/5 transition-[transform] duration-300 ease-[cubic-bezier(0.22,1,0.28,1)] will-change-transform backdrop-blur-sm sm:p-2" style={{ transform: `scale(${clampedZoom})`, transformOrigin: "center center" }}>
                      <div className="relative" style={{ width: pageFitWidth, aspectRatio: "2/3" }}>
                        <Image src={previewPages[previewIndex] || previewPages[0]!} alt={`Preview page ${previewIndex + 1}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 420px" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="reader-pdf relative flex w-full max-w-full items-center justify-center overflow-hidden">
                    <Document file={file} loading={<PdfDocumentSkeleton />} error={<div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl"><p className="text-sm font-bold text-white">Could not load PDF</p><p className="mt-2 text-xs text-zinc-400">Ensure <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand">{pdfPath}</code> exists. Worker must match react-pdf ({pdfjs.version}).</p>{loadError ? <p className="mt-2 text-xs text-red-400">{loadError}</p> : null}</div>} onLoadSuccess={onDocumentLoad} onLoadError={(e) => { const message = String((e as Error)?.message ?? "Unknown error"); setLoadError(message); console.error("[Reader] onLoadError", { message, pdfPath: file }); }}>
                      {numPages ? (
                        <div key={previewIndex + 1} dir="ltr" className="rounded-sm border border-white/10 bg-white/10 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/5 transition-[transform] duration-300 ease-[cubic-bezier(0.22,1,0.28,1)] will-change-transform backdrop-blur-sm sm:p-2" style={{ transform: `scale(${clampedZoom})`, transformOrigin: "center center" }}>
                          <Page pageNumber={previewIndex + 1} width={pageFitWidth} className="!bg-transparent" renderTextLayer={false} renderAnnotationLayer={false} loading={<PdfPageSkeleton width={pageFitWidth} />} onLoadSuccess={(page) => { const v = page.getViewport({ scale: 1 }); setPdfPageDim({ w: v.width, h: v.height }); }} />
                        </div>
                      ) : null}
                    </Document>
                  </div>
                )
              ) : file ? (
                <div className="reader-pdf relative flex w-full max-w-full items-center justify-center overflow-hidden">
                  <Document file={file} loading={<PdfDocumentSkeleton />} error={<div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl"><p className="text-sm font-bold text-white">Could not load PDF</p><p className="mt-2 text-xs text-zinc-400">Ensure <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand">{pdfPath}</code> exists. Worker must match react-pdf ({pdfjs.version}).</p>{loadError ? <p className="mt-2 text-xs text-red-400">{loadError}</p> : null}</div>} onLoadSuccess={onDocumentLoad} onLoadError={(e) => { const message = String((e as Error)?.message ?? "Unknown error"); setLoadError(message); console.error("[Reader] onLoadError", { message, pdfPath: file }); }}>
                    {numPages ? (
                      <div key={safeCurrentPage} dir="ltr" className="rounded-sm border border-white/10 bg-white/10 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/5 transition-[transform] duration-300 ease-[cubic-bezier(0.22,1,0.28,1)] will-change-transform backdrop-blur-sm sm:p-2" style={{ transform: `scale(${clampedZoom})`, transformOrigin: "center center" }}>
                        <Page pageNumber={safeCurrentPage} width={pageFitWidth} className="!bg-transparent" renderTextLayer={false} renderAnnotationLayer={false} loading={<PdfPageSkeleton width={pageFitWidth} />} onLoadSuccess={(page) => { const v = page.getViewport({ scale: 1 }); setPdfPageDim({ w: v.width, h: v.height }); }} />
                      </div>
                    ) : null}
                  </Document>
                </div>
              ) : (
                <div className="flex min-h-[40vh] w-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-zinc-400">No preview available for this comic.</p>
                    <button type="button" onClick={handleBackToComics} className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">Back to Comics</button>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-6 shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              {isPreviewMode ? (<>Preview <span className="text-white">{previewIndex + 1}</span> / <span className="tabular-nums">{maxPreview}</span> <span className="ml-2 text-zinc-500">(Sample)</span></>) : (<>Page <span className="text-white">{numPages ? safeCurrentPage : "—"}</span>{numPages ? <><span> / </span><span className="tabular-nums">{numPages}</span></> : null}</>)}
            </p>
          </div>
        </main>

        <aside className="hidden w-[min(100%,280px)] shrink-0 border-white/10 bg-black/50 backdrop-blur-2xl xl:block xl:border-l">
          <div className="flex h-[calc(100dvh-3.5rem)] flex-col gap-6 overflow-y-auto p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Details</p>
              <h2 className="mt-2 font-serif text-xl text-white">{title}</h2>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-zinc-400">Creators</p>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="text-zinc-300"><span className="font-bold text-white">Elias Thorne</span> — <span className="text-zinc-500">Art</span></li>
                <li className="text-zinc-300"><span className="font-bold text-white">Mira Okonkwo</span> — <span className="text-zinc-500">Color</span></li>
              </ul>
            </div>
            <div className="border-t border-white/10 pt-5">
              {SPECS.map((row) => (<div key={row.k} className="flex justify-between gap-3 border-b border-white/5 py-2 text-[11px] last:border-b-0"><span className="text-zinc-500">{row.k}</span><span className="text-right text-zinc-300">{row.v}</span></div>))}
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-zinc-400">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">{TAGS.map((t) => (<span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-zinc-300 backdrop-blur-sm">{t}</span>))}</div>
            </div>
            <div className="mt-auto border-t border-white/10 pt-5">
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand/30 bg-black/40 py-3 text-xs font-black uppercase tracking-wide text-brand backdrop-blur-sm transition hover:border-brand/50 hover:bg-black/60">
                <i className="fa-solid fa-cart-shopping" aria-hidden />Print edition
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/70" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2">
            <button type="button" className={readerBarRoundBtn} aria-label="Previous page" disabled={isPreviewMode ? (!showLocked && previewIndex <= 0) : (!numPages || safeCurrentPage <= 1)} onClick={goBackInReadingOrder}><span className="text-[1.35rem] font-black leading-none tracking-tight" aria-hidden>{"<"}</span></button>
            <button type="button" className={readerBarRoundBtn} aria-label="Next page" disabled={isPreviewMode ? showLocked : (!numPages || safeCurrentPage >= (numPages ?? 0))} onClick={goForwardInReadingOrder}><span className="text-[1.35rem] font-black leading-none tracking-tight" aria-hidden>{">"}</span></button>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={readerBarRoundBtn} aria-label="Zoom out" disabled={clampedZoom <= ZOOM_MIN} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}><span className="text-[1.45rem] font-semibold leading-none" aria-hidden>−</span></button>
            <span className="min-w-[3rem] text-center text-xs font-bold tabular-nums text-zinc-300">{Math.round(clampedZoom * 100)}%</span>
            <button type="button" className={readerBarRoundBtn} aria-label="Zoom in" disabled={clampedZoom >= ZOOM_MAX} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}><span className="text-[1.45rem] font-semibold leading-none" aria-hidden>+</span></button>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            {isPreviewMode ? (<>Preview <span className="text-white">{previewIndex + 1}</span> / <span className="tabular-nums">{maxPreview}</span></>) : (<>Page <span className="text-white">{numPages ? safeCurrentPage : "—"}</span>{numPages ? <span className="text-zinc-500"> / {numPages}</span> : null}</>)}
          </p>
        </div>
      </div>

      {tocOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/70 backdrop-blur-xl" role="dialog" aria-modal>
          <div className="flex items-center justify-between border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-widest text-white">Contents</p>
            <button type="button" onClick={() => setTocOpen(false)} className="text-2xl leading-none text-zinc-400 transition hover:text-white" aria-label="Close">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarItems.map((item) => (
              <button key={item.id} type="button" className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-sm transition hover:border-brand/35 hover:bg-white/10" onClick={() => {
                if (isPreviewMode) setShowLocked(true);
                else if (numPages) setCurrentPage(Math.min(item.page, numPages));
                setTocOpen(false);
              }}>
                <span className="text-xs text-zinc-400">{item.label} · Pg. {String(item.page).padStart(3, "0")}</span>
                <p className="font-semibold text-white">{item.title}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}