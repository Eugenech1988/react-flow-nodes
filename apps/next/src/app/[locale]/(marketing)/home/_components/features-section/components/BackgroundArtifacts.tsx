import { GLITCH_BARS_H, GLITCH_BARS_V, CROSSHAIRS, SIGNAL_DOTS } from '../constants';

export const BackgroundArtifacts = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,color-mix(in_oklab,var(--theme-accent)_2.5%,transparent)_2px,color-mix(in_oklab,var(--theme-accent)_2.5%,transparent)_3px)]" />

    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,color-mix(in_oklab,var(--theme-bg)_55%,transparent)_100%)]" />

    {CROSSHAIRS.map((pos) => (
      <div key={pos} className={`absolute ${pos} h-4 w-4`}>
        <div className="bg-theme-accent/30 absolute top-1/2 left-0 h-px w-full" />
        <div className="bg-theme-accent/30 absolute top-0 left-1/2 h-full w-px" />
      </div>
    ))}

    {GLITCH_BARS_H.map((bar, i) => (
      <div
        key={`gh-${i}`}
        className="bg-theme-accent/40 absolute h-px animate-pulse motion-reduce:animate-none"
        style={{
          top: bar.top,
          left: bar.left,
          right: bar.right,
          width: bar.width,
          animationDelay: bar.delay,
        }}
      />
    ))}

    {GLITCH_BARS_V.map((bar, i) => (
      <div
        key={`gv-${i}`}
        className="bg-theme-accent/30 absolute w-px animate-pulse motion-reduce:animate-none"
        style={{
          left: bar.left,
          right: bar.right,
          top: bar.top,
          height: bar.height,
          animationDelay: bar.delay,
        }}
      />
    ))}

    {SIGNAL_DOTS.map((dot, i) => (
      <div
        key={`sd-${i}`}
        className="bg-theme-accent/60 absolute h-1 w-1 animate-pulse rounded-full motion-reduce:animate-none"
        style={{
          top: dot.top,
          left: dot.left,
          animationDelay: dot.delay,
          boxShadow: '0 0 6px var(--theme-accent)',
        }}
      />
    ))}

    <div
      className="via-theme-accent/40 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent motion-reduce:hidden"
      style={{ animation: 'artifact-scanline 9s linear infinite' }}
    />

    <div className="text-theme-accent/25 absolute top-1/2 left-3 -translate-y-1/2 rotate-180 font-mono text-[8px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
      0x7F.SYS.001 //// SIGNAL.LOCKED
    </div>
    <div className="text-theme-accent/25 absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[8px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
      0x7F.SYS.002 //// DATA.STREAM
    </div>

    <div className="text-theme-accent/30 absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-widest uppercase md:flex">
      <span>LAT 47.3769</span>
      <span className="bg-theme-accent/40 h-1 w-1 rounded-full" />
      <span>LON 8.5417</span>
      <span className="bg-theme-accent/40 h-1 w-1 rounded-full" />
      <span>ALT 408M</span>
    </div>
  </div>
);
