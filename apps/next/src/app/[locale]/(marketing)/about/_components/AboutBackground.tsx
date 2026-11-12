import { Cog, Settings2, Database } from 'lucide-react';

export const AboutBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
    <div className="bg-theme-accent/5 absolute top-0 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full blur-[150px] sm:h-200 sm:w-250" />

    <div className="absolute -top-20 -left-20 opacity-5 sm:-top-40 sm:-left-40">
      <Cog className="text-theme-accent h-75 w-75 sm:h-200 sm:w-200" strokeWidth={0.5} />
    </div>

    <div className="absolute top-1/3 -right-20 opacity-5 sm:-right-40">
      <Settings2 className="text-theme-accent h-62.5 w-62.5 sm:h-150 sm:w-150" strokeWidth={0.5} />
    </div>

    <Database
      className="text-theme-accent absolute bottom-20 left-10 h-50 w-50 opacity-[0.02] sm:h-100 sm:w-100"
      strokeWidth={0.5}
    />
  </div>
);
