"use client";

import { useState } from "react";

export interface DownloadPdfButtonProps {
  /** Suggested filename for the PDF (e.g. "comic-title.pdf") */
  fileName?: string;
  /** Product or comic ID for future API use */
  productId?: string | number;
  /** Placeholder for future download URL */
  downloadUrl?: string;
  /** Controlled loading state; when undefined, component manages loading internally */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Visual variant: primary (yellow) or secondary (gray) */
  variant?: "primary" | "secondary";
  /** Optional class name for the wrapper (e.g. flex-1 for product page row) */
  className?: string;
  /** Force full width (e.g. on mobile); default true for consistency with other CTAs */
  fullWidth?: boolean;
  /** Optional callback when download is triggered; default logs "Download started" */
  onDownload?: (params: { fileName?: string; productId?: string | number; downloadUrl?: string }) => void;
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Mock handler for PDF download (UI only). Replace with real API call later.
 */
function defaultHandlePdfDownload(params: {
  fileName?: string;
  productId?: string | number;
  downloadUrl?: string;
}) {
  console.log("Download started", params);
}

export default function DownloadPdfButton({
  fileName,
  productId,
  downloadUrl,
  loading: controlledLoading,
  disabled = false,
  variant = "secondary",
  className = "",
  fullWidth = true,
  onDownload,
}: DownloadPdfButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isLoading = controlledLoading !== undefined ? controlledLoading : internalLoading;
  const isDisabled = disabled || isLoading;

  const handleClick = async () => {
    if (isDisabled) return;
    const handler = onDownload ?? defaultHandlePdfDownload;
    if (controlledLoading === undefined) setInternalLoading(true);
    try {
      handler({ fileName, productId, downloadUrl });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      if (controlledLoading === undefined) setInternalLoading(false);
    }
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryClasses =
    "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black";
  const secondaryClasses =
    "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700";
  const widthClass = fullWidth ? "w-full sm:w-auto flex-1 min-w-0" : "";

  const variantClasses = variant === "primary" ? primaryClasses : secondaryClasses;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      aria-label={showSuccess ? "Download complete" : "Download PDF"}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="w-5 h-5 animate-spin shrink-0" />
          <span>Preparing download…</span>
        </>
      ) : showSuccess ? (
        <>
          <CheckIcon className="w-5 h-5 shrink-0 text-green-400" />
          <span>Download started</span>
        </>
      ) : (
        <>
          <DownloadIcon className="w-5 h-5 shrink-0" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
}
