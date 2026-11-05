'use client';

import { ArrowRight, Play } from 'lucide-react';
// import { HeroFlowCanvas } from '@/components/react/HeroFlowCanvas';
import { HeroHeading } from '@/shared/ui';

const Hero = () => {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,47,46,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,47,46,0.4)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-30 text-center sm:px-6 lg:px-8">

        <HeroHeading
          title="Visualize complex logic with drag-and-drop simplicity"
          description="A powerful canvas for building interactive nodes and connections. Design complex workflows, manage application data, and automate processes on the fly."
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-teal-900/40 bg-linear-to-r from-teal-500 to-teal-600 px-8 py-4 font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_4px_14px_rgba(57,179,155,0.25)] transition-all duration-300 before:absolute before:inset-0 before:bg-linear-to-r before:from-teal-400 before:to-teal-500 before:opacity-0 hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(57,179,155,0.5)] hover:before:opacity-100 active:scale-[0.98] sm:w-auto">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <a href="/request-demo" className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-teal-500/30 hover:bg-white/10 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_15px_rgba(57,179,155,0.2)] sm:w-auto">
            <Play className="h-4 w-4 fill-current text-teal-400 drop-shadow-[0_0_4px_rgba(57,179,155,0.6)]" />
            Request Demo
          </a>
        </div>

        <div className="relative mx-auto mt-16 w-full max-w-5xl">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-teal-500/5 blur-xl" />

          <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#0a1210]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_1px,transparent_1.5px)] bg-[size:10px_10px] opacity-20" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(57,179,155,0.03)_50%,transparent_100%)]" />

            <div className="relative z-10 h-full w-full">
              {/*<HeroFlowCanvas />*/}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;