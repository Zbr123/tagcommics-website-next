"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "./reader-pdf.css";
import { READER_DEFAULT_TITLE } from "./readerConstants";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type Chapter = { id: string; page: number; label: string; title: string; blurb: string };

const CHAPTERS: Chapter[] = [
  { id: "c1", page: 1, label: "01", title: "Cold Open", blurb: "Gotham skyline — tone and stakes." },
  { id: "c2", page: 4, label: "02", title: "Neon Alley", blurb: "First confrontation in the rain." },
  { id: "c3", page: 12, label: "03", title: "Signal Run", blurb: "Chase sequence across rooftops." },
  { id: "c4", page: 22, label: "04", title: "Clocktower", blurb: "Briefing before the finale." },
];

const SPECS: { k: string; v: string }[] = [
  { k: "Format", v: "Digital · Print-ready" },
  { k: "Dimensions", v: "6.625 × 10.25 in" },
  { k: "Color profile", v: "CMYK / Screen RGB" },
  { k: "Published", v: "2026 · ComicVerse" },
];

const TAGS = ["Noir", "Urban", "Sci-Fi", "Crime"];

function fileUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

/** Bottom bar: frosted controls (transparent black + blur on light canvas) */
const readerBarRoundBtn =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 bg-black/25 text-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition select-none hover:border-brand/40 hover:bg-black/35 hover:text-brand focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-35 disabled:hover:border-black/15 disabled:hover:bg-black/25 disabled:hover:text-zinc-900";

/** 1 = 100% fit; zoom out lowers scale. PDF is rasterized at fit width, then CSS-scaled for smooth motion. */
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.035;

/** Typical comic page width/height in PDF units before metrics load (portrait). */
const PDF_WH_RATIO_FALLBACK = 0.648;

function PdfDocumentSkeleton() {
  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-16"
      aria-busy="true"
      aria-label="Loading PDF"
    >
      <div className="h-2 w-full max-w-[12rem] animate-pulse rounded-full bg-black/15" />
      <div className="aspect-[2/3] w-full max-w-[min(88vw,420px)] animate-pulse rounded-lg bg-black/10 shadow-inner ring-1 ring-black/10" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Loading PDF…</p>
    </div>
  );
}

function PdfPageSkeleton({ width }: { width: number }) {
  const minH = Math.max(200, Math.round(width / PDF_WH_RATIO_FALLBACK));
  return (
    <div
      style={{ width, minHeight: minH }}
      className="flex flex-col gap-2 rounded-sm border border-black/10 bg-black/10 p-2 shadow-sm backdrop-blur-sm"
      aria-hidden
    >
      <div className="min-h-[58%] w-full flex-1 animate-pulse rounded bg-black/10" />
      <div className="h-2 w-[80%] animate-pulse rounded bg-black/10" />
      <div className="h-2 w-[55%] animate-pulse rounded bg-black/5" />
    </div>
  );
}

export interface ReaderExperienceProps {
  pdfPath: string;
  title?: string;
  subtitle?: string;
}

export default function ReaderExperience({ pdfPath, title = READER_DEFAULT_TITLE, subtitle }: ReaderExperienceProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const [fitBox, setFitBox] = useState({ w: 880, h: 560 });
  const [pdfPageDim, setPdfPageDim] = useState<{ w: number; h: number } | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(CHAPTERS[0]!.id);
  const pdfViewportRef = useRef<HTMLDivElement | null>(null);

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
  const safeCurrentPage = numPages ? Math.min(Math.max(currentPage, 1), numPages) : 1;

  const activeChapterIndex = CHAPTERS.findIndex((c) => c.id === activeChapterId);

  const goBackInReadingOrder = useCallback(() => {
    if (!numPages) return;
    setCurrentPage((p) => Math.max(1, p - 1));
  }, [numPages]);

  const goForwardInReadingOrder = useCallback(() => {
    if (!numPages) return;
    setCurrentPage((p) => Math.min(numPages, p + 1));
  }, [numPages]);

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
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const href = fileUrl(pdfPath);
    if (typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = "fetch";
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [pdfPath]);

  useEffect(() => {
    const ch = [...CHAPTERS].reverse().find((c) => currentPage >= c.page);
    if (ch) setActiveChapterId(ch.id);
  }, [currentPage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBackInReadingOrder();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goForwardInReadingOrder();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBackInReadingOrder, goForwardInReadingOrder]);

  /** Scroll-lock only: prevent the site chrome / document from scrolling behind the reader. */
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
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

  useEffect(() => {
    if (!numPages) return;
    setCurrentPage((p) => Math.min(Math.max(p, 1), numPages));
  }, [numPages]);

  const file = useMemo(() => fileUrl(pdfPath), [pdfPath]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-zinc-300/90 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-black/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/15">
        <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/comics"
            className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-900"
          >
            ← Back
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-xs font-black uppercase tracking-[0.14em] text-zinc-900 sm:text-sm">{title}</h1>
            {subtitle ? <p className="truncate text-[10px] text-zinc-600">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="hidden rounded-full border border-zinc-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600 backdrop-blur-md transition hover:border-zinc-300 hover:text-zinc-900 lg:inline-flex"
            >
              Contents
            </button> */}
            <Link
              href="/comic/2"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/15 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-900 backdrop-blur-sm transition hover:border-brand/45 hover:bg-black/30 hover:text-brand sm:px-4 sm:text-[11px]"
            >
              <i className="fa-solid fa-cart-shopping text-[11px]" aria-hidden />
              Purchase
            </Link>
            {/* <Link
              href=""
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
              aria-label="Close reader"
            >
              <span className="text-lg leading-none">×</span>
            </Link> */}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1920px] flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="hidden w-[min(100%,260px)] shrink-0 border-black/10 bg-black/15 backdrop-blur-2xl lg:block lg:border-r">
          <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto p-5">
            <p className="font-serif text-xl font-semibold text-zinc-900">Contents</p>
            <p className="mt-1 text-xs text-zinc-600">Chapters — tap to jump.</p>
            <div className="mt-6 space-y-1 border-t border-black/10 pt-5">
              {CHAPTERS.map((ch) => {
                const active = ch.id === activeChapterId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      if (numPages) setCurrentPage(Math.min(ch.page, numPages));
                      setActiveChapterId(ch.id);
                    }}
                    className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition ${
                      active
                        ? "border-brand/45 bg-black/15 shadow-[0_0_20px_rgba(88,232,193,0.12)]"
                        : "border-transparent hover:border-black/10 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex justify-between gap-2 text-[10px] text-zinc-600">
                      <span className="font-bold text-zinc-600">{ch.label}</span>
                      <span>Pg. {String(ch.page).padStart(3, "0")}</span>
                    </div>
                    <span className={`text-sm font-semibold ${active ? "text-zinc-900" : "text-zinc-800"}`}>{ch.title}</span>
                    <span className="text-[11px] leading-snug text-zinc-600">{ch.blurb}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-5 text-xs font-semibold text-zinc-600">
              <button type="button" className="transition hover:text-zinc-900" onClick={goBackInReadingOrder}>
                ← Back
              </button>
              <div className="flex gap-1.5" aria-hidden>
                {CHAPTERS.map((ch, i) => (
                  <span key={ch.id} className={`h-1.5 w-1.5 rounded-full ${i === activeChapterIndex ? "bg-brand" : "bg-black/25"}`} />
                ))}
              </div>
              <button type="button" className="transition hover:text-zinc-900" onClick={goForwardInReadingOrder}>
                Forward →
              </button>
            </div>
          </div>
        </aside>

        <main id="reader-stage" className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-black/10 backdrop-blur-md lg:min-h-[calc(100dvh-3.5rem)]">
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-28 pt-6 sm:px-10 sm:pb-32">
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="mb-4 flex shrink-0 flex-col items-center gap-1 text-zinc-600 transition hover:text-zinc-900 lg:hidden"
            >
              <i className="fa-solid fa-book-open text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
            </button>

            <div
              ref={pdfViewportRef}
              className="flex min-h-[50dvh] w-full flex-1 flex-col items-center justify-center overflow-hidden sm:min-h-[56dvh]"
            >
            <div className="reader-pdf relative flex w-full max-w-full items-center justify-center overflow-hidden">
              <Document
                file={file}
                loading={<PdfDocumentSkeleton />}
                error={
                  <div className="max-w-md rounded-2xl border border-black/10 bg-black/25 p-6 text-center backdrop-blur-xl">
                    <p className="text-sm font-bold text-zinc-900">Could not load PDF</p>
                    <p className="mt-2 text-xs text-zinc-700">
                      Ensure <code className="rounded bg-black/15 px-1.5 py-0.5 text-brand">public{pdfPath}</code> exists. Worker must match react-pdf ({pdfjs.version}).
                    </p>
                    {loadError ? <p className="mt-2 text-xs text-red-600">{loadError}</p> : null}
                  </div>
                }
                onLoadSuccess={onDocumentLoad}
                onLoadError={(e) => {
                  const message = String((e as Error)?.message ?? "Unknown error");
                  setLoadError(message);
                  console.error("[Reader] onLoadError", { message, pdfPath: file });
                }}
              >
                {numPages ? (
                  <div
                    key={safeCurrentPage}
                    dir="ltr"
                    className="rounded-sm border border-black/10 bg-white/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-[transform] duration-300 ease-[cubic-bezier(0.22,1,0.28,1)] will-change-transform backdrop-blur-sm sm:p-2"
                    style={{
                      transform: `scale(${clampedZoom})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <Page
                      pageNumber={safeCurrentPage}
                      width={pageFitWidth}
                      className="!bg-transparent"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<PdfPageSkeleton width={pageFitWidth} />}
                      onLoadSuccess={(page) => {
                        const v = page.getViewport({ scale: 1 });
                        setPdfPageDim({ w: v.width, h: v.height });
                      }}
                    />
                  </div>
                ) : null}
              </Document>
            </div>
            </div>

            <p className="mt-6 shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
              Page <span className="text-zinc-900">{numPages ? safeCurrentPage : "—"}</span>
              {numPages ? (
                <>
                  <span> / </span>
                  <span className="tabular-nums">{numPages}</span>
                </>
              ) : null}
            </p>
          </div>
        </main>

        <aside className="hidden w-[min(100%,280px)] shrink-0 border-black/10 bg-black/15 backdrop-blur-2xl xl:block xl:border-l">
          <div className="flex h-[calc(100dvh-3.5rem)] flex-col gap-6 overflow-y-auto p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Details</p>
              <h2 className="mt-2 font-serif text-xl text-zinc-900">{title}</h2>
            </div>
            <div className="border-t border-black/10 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-zinc-600">Creators</p>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="text-zinc-800">
                  <span className="font-bold text-zinc-900">Elias Thorne</span> — <span className="text-zinc-600">Art</span>
                </li>
                <li className="text-zinc-800">
                  <span className="font-bold text-zinc-900">Mira Okonkwo</span> — <span className="text-zinc-600">Color</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-black/10 pt-5">
              {SPECS.map((row) => (
                <div key={row.k} className="flex justify-between gap-3 border-b border-black/5 py-2 text-[11px] last:border-b-0">
                  <span className="text-zinc-600">{row.k}</span>
                  <span className="text-right text-zinc-800">{row.v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-zinc-600">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <span key={t} className="rounded-full border border-black/10 bg-black/10 px-2.5 py-1 text-[10px] text-zinc-800 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto border-t border-black/10 pt-5">
              <Link
                href="/comic/2"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/15 bg-black/25 py-3 text-xs font-black uppercase tracking-wide text-zinc-900 backdrop-blur-sm transition hover:border-brand/40 hover:bg-black/35 hover:text-brand"
              >
                <i className="fa-solid fa-cart-shopping" aria-hidden />
                Print edition
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-black/25 px-4 py-3 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={readerBarRoundBtn}
              aria-label="Previous page"
              disabled={!numPages || safeCurrentPage <= 1}
              onClick={goBackInReadingOrder}
            >
              <span className="text-[1.35rem] font-black leading-none tracking-tight" aria-hidden>
                {"<"}
              </span>
            </button>
            <button
              type="button"
              className={readerBarRoundBtn}
              aria-label="Next page"
              disabled={!numPages || safeCurrentPage >= (numPages ?? 0)}
              onClick={goForwardInReadingOrder}
            >
              <span className="text-[1.35rem] font-black leading-none tracking-tight" aria-hidden>
                {">"}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={readerBarRoundBtn}
              aria-label="Zoom out"
              disabled={clampedZoom <= ZOOM_MIN}
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
            >
              <span className="text-[1.45rem] font-semibold leading-none" aria-hidden>
                −
              </span>
            </button>
            <span className="min-w-[3rem] text-center text-xs font-bold tabular-nums text-zinc-800">{Math.round(clampedZoom * 100)}%</span>
            <button
              type="button"
              className={readerBarRoundBtn}
              aria-label="Zoom in"
              disabled={clampedZoom >= ZOOM_MAX}
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
            >
              <span className="text-[1.45rem] font-semibold leading-none" aria-hidden>
                +
              </span>
            </button>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
            Page <span className="text-zinc-900">{numPages ? safeCurrentPage : "—"}</span>
            {numPages ? <span className="text-zinc-700"> / {numPages}</span> : null}
          </p>
        </div>
      </div>

      {tocOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/35 backdrop-blur-xl" role="dialog" aria-modal>
          <div className="flex items-center justify-between border-b border-black/10 bg-black/20 px-4 py-3 backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-700">Contents</p>
            <button type="button" onClick={() => setTocOpen(false)} className="text-2xl leading-none text-zinc-600 transition hover:text-zinc-900" aria-label="Close">
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className="mb-2 w-full rounded-xl border border-black/10 bg-black/15 px-4 py-3 text-left backdrop-blur-sm transition hover:border-brand/35 hover:bg-black/25"
                onClick={() => {
                  if (numPages) setCurrentPage(Math.min(ch.page, numPages));
                  setTocOpen(false);
                }}
              >
                <span className="text-xs text-zinc-600">
                  {ch.label} · Pg. {String(ch.page).padStart(3, "0")}
                </span>
                <p className="font-semibold text-zinc-900">{ch.title}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
