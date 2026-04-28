import ArsenalSection from "@/src/components/design-team/ArsenalSection";
import DesignStudioVideo from "@/src/components/design-team/DesignStudioVideo";
import DesignTeamHero from "@/src/components/design-team/DesignTeamHero";
import JoinInitiativeSection from "@/src/components/design-team/JoinInitiativeSection";
import PrinciplesSection from "@/src/components/design-team/PrinciplesSection";
import TeamRoster from "@/src/components/design-team/TeamRoster";

export default function DesignTeamPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] text-white">
      <DesignTeamHero />
      <div className="mx-auto h-px w-[min(1440px,calc(100%-2rem))] bg-gradient-to-r from-transparent via-white/12 to-transparent sm:w-[min(1440px,calc(100%-3rem))]" />
      <DesignStudioVideo />
      <div className="mx-auto h-px w-[min(1440px,calc(100%-2rem))] bg-gradient-to-r from-transparent via-white/12 to-transparent sm:w-[min(1440px,calc(100%-3rem))]" />
      <TeamRoster />
      <div className="mx-auto h-px w-[min(1440px,calc(100%-2rem))] bg-gradient-to-r from-transparent via-white/12 to-transparent sm:w-[min(1440px,calc(100%-3rem))]" />

      <section className="px-6 py-24">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-2 2xl:gap-14">
          <PrinciplesSection />
          <ArsenalSection />
        </div>
      </section>
      <div className="mx-auto h-px w-[min(1440px,calc(100%-2rem))] bg-gradient-to-r from-transparent via-white/12 to-transparent sm:w-[min(1440px,calc(100%-3rem))]" />
      <JoinInitiativeSection />
    </main>
  );
}
