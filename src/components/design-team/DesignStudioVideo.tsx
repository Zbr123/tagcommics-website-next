"use client";

export default function DesignStudioVideo() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-black/55 shadow-[0_30px_95px_rgba(0,0,0,0.62)]">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-brand/20" />
          <div className="relative h-[260px] w-full sm:h-[330px] md:h-[420px] lg:h-[500px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/vedios/teampage.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/55 to-black/75" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(88,232,193,0.2),transparent_48%)]" />

          </div>
        </div>
      </div>
    </section>
  );
}
