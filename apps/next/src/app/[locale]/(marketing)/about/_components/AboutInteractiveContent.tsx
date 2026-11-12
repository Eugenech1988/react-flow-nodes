import { MissionSection } from './MissionSection';
import { PrinciplesSection } from './PrinciplesSection';
import { CrewSection } from './CrewSection';
import { CtaSection } from './CtaSection';

export const AboutInteractiveContent = () => (
  <div className="text-theme-fg relative isolate overflow-hidden">
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--theme-accent)_1px,transparent_0)] bg-size-[28px_28px] opacity-[0.025]" />
      <div className="border-theme-accent/4 absolute top-40 -left-48 h-112.5 w-112.5 rounded-full border" />
      <div className="border-theme-accent/4 absolute top-[45%] -right-52 h-125 w-125 rounded-full border" />
      <div className="bg-theme-accent/2.5 absolute top-0 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full blur-[120px]" />
    </div>

    <div className="relative mx-auto max-w-6xl space-y-16 px-4 py-8 sm:space-y-24 sm:px-6 lg:space-y-36">
      <MissionSection />
      <PrinciplesSection />
      <CrewSection />
      <CtaSection />
    </div>
  </div>
);
