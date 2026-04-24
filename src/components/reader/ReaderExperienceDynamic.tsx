"use client";

import dynamic from "next/dynamic";
import type { ReaderExperienceProps } from "./ReaderExperience";

function ReaderChunkLoading() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-zinc-300/90 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-black/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/15">
        <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-16 animate-pulse rounded bg-black/10" />
          <div className="mx-auto h-4 w-40 max-w-[50%] animate-pulse rounded bg-black/10" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-black/10" />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center bg-black/10 px-4 backdrop-blur-sm">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-black/10 bg-black/15 p-8 shadow-lg backdrop-blur-xl">
          <div className="h-3 w-[75%] animate-pulse rounded bg-black/10" />
          <div className="aspect-[2/3] w-full max-w-[280px] animate-pulse rounded-lg bg-black/10 ring-1 ring-black/10" />
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">Preparing reader…</p>
        </div>
      </div>
    </div>
  );
}

const ReaderExperience = dynamic(() => import("./ReaderExperience"), {
  ssr: false,
  loading: () => <ReaderChunkLoading />,
});

export default function ReaderExperienceDynamic(props: ReaderExperienceProps) {
  return <ReaderExperience {...props} />;
}
