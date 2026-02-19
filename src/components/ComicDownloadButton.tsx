"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";

export interface ComicDownloadButtonProps {
  /** PDF path under public (e.g. "/comics/Batman 001.pdf") — served statically at root */
  pdfPath?: string;
  /** Card title (e.g. "Batman 001" or comic name) */
  title?: string;
  /** Optional thumbnail image src (e.g. /comic-slider1.png) */
  thumbnailSrc?: string;
  /** Optional class for the card wrapper */
  className?: string;
}

const DEFAULT_PDF = "/comics/Batman 001.pdf";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export default function ComicDownloadButton({
  pdfPath = DEFAULT_PDF,
  title = "Read & Download",
  thumbnailSrc,
  className = "",
}: ComicDownloadButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useAuth();

  const pdfUrl = pdfPath.startsWith("/") ? pdfPath : `/${pdfPath}`;
  const encodedUrl = encodeURI(pdfUrl);

  const handleOpenPdf = () => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/"));
      return;
    }
    window.open(encodedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-400/50 transition-all ${className}`}
    >
      {/* Card header: title + optional thumbnail */}
      <div className="p-4 sm:p-5 border-b border-gray-800">
        <h3 className="text-lg font-black text-white mb-2">Digital copy</h3>
        {thumbnailSrc && (
          <div className="relative w-full aspect-[3/4] max-h-40 sm:max-h-48 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 mb-4">
            <Image
              src={thumbnailSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
            />
          </div>
        )}
        <p className="text-gray-400 text-sm">{title}</p>
      </div>

      {/* Download Options */}
      <div className="p-4 sm:p-5">
        <h4 className="text-white font-bold text-sm mb-3">Download options</h4>
        {!user && isLoaded && (
          <p className="text-yellow-400/90 text-xs mb-2">Sign in to download this PDF.</p>
        )}
        <button
          type="button"
          onClick={handleOpenPdf}
          disabled={!isLoaded}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-70 disabled:cursor-not-allowed"
          aria-label={user ? "Download PDF — opens in new tab" : "Sign in to download PDF"}
        >
          <DownloadIcon className="w-5 h-5 shrink-0" />
          {user ? "Download PDF" : "Sign in to Download PDF"}
        </button>
      </div>
    </div>
  );
}
