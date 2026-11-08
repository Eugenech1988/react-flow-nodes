import { GLITCH_BARS_H, GLITCH_BARS_V, CROSSHAIRS, SIGNAL_DOTS } from '../model';

export const BackgroundArtifacts = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(45,212,191,0.025)_2px,rgba(45,212,191,0.025)_3px)]" />

    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,10,9,0.55)_100%)]" />

    {CROSSHAIRS.map((pos) => (
      <div key={pos} className={`absolute ${pos} h-4 w-4`}>
        <div className="absolute top-1/2 left-0 h-px w-full bg-[#2dd4bf]/30" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-[#2dd4bf]/30" />
      </div>
    ))}

    {GLITCH_BARS_H.map((bar, i) => (
      <div
        key={`gh-${i}`}
        className="absolute h-px animate-pulse bg-[#2dd4bf]/40 motion-reduce:animate-none"
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
        className="absolute w-px animate-pulse bg-[#2dd4bf]/30 motion-reduce:animate-none"
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
        className="absolute h-1 w-1 animate-pulse rounded-full bg-[#2dd4bf]/60 motion-reduce:animate-none"
        style={{
          top: dot.top,
          left: dot.left,
          animationDelay: dot.delay,
          boxShadow: '0 0 6px rgba(45,212,191,0.6)',
        }}
      />
    ))}

    <div
      className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#2dd4bf]/40 to-transparent motion-reduce:hidden"
      style={{ animation: 'artifact-scanline 9s linear infinite' }}
    />

    <div className="absolute top-1/2 left-3 -translate-y-1/2 rotate-180 font-mono text-[8px] tracking-[0.3em] text-[#2dd4bf]/25 uppercase [writing-mode:vertical-rl]">
      0x7F.SYS.001 //// SIGNAL.LOCKED
    </div>
    <div className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[8px] tracking-[0.3em] text-[#2dd4bf]/25 uppercase [writing-mode:vertical-rl]">
      0x7F.SYS.002 //// DATA.STREAM
    </div>

    {/* Bottom HUD */}
    <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-widest text-[#2dd4bf]/30 uppercase md:flex">
      <span>LAT 47.3769</span>
      <span className="h-1 w-1 rounded-full bg-[#2dd4bf]/40" />
      <span>LON 8.5417</span>
      <span className="h-1 w-1 rounded-full bg-[#2dd4bf]/40" />
      <span>ALT 408M</span>
    </div>
  </div>
);
