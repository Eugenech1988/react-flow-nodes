const CROSSHAIRS = ['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'];

const STARS = [
  { top: '8%', left: '12%', size: 'xs', twinkle: '0s' },
  { top: '12%', left: '34%', size: 'sm', twinkle: '1.2s' },
  { top: '6%', left: '58%', size: 'xs', twinkle: '2.4s' },
  { top: '10%', left: '82%', size: 'md', twinkle: '0.6s' },
  { top: '18%', left: '22%', size: 'xs', twinkle: '3.6s' },
  { top: '22%', left: '68%', size: 'sm', twinkle: '1.8s' },
  { top: '16%', left: '92%', size: 'xs', twinkle: '4.2s' },
  { top: '28%', left: '8%', size: 'sm', twinkle: '0.9s' },
  { top: '32%', left: '44%', size: 'xs', twinkle: '2.7s' },
  { top: '30%', left: '88%', size: 'md', twinkle: '3.3s' },
  { top: '40%', left: '16%', size: 'xs', twinkle: '1.5s' },
  { top: '44%', left: '52%', size: 'sm', twinkle: '0.3s' },
  { top: '42%', left: '78%', size: 'xs', twinkle: '4.8s' },
  { top: '52%', left: '6%', size: 'md', twinkle: '2.1s' },
  { top: '56%', left: '36%', size: 'xs', twinkle: '3.9s' },
  { top: '54%', left: '72%', size: 'sm', twinkle: '0.7s' },
  { top: '60%', left: '94%', size: 'xs', twinkle: '1.1s' },
  { top: '66%', left: '20%', size: 'sm', twinkle: '2.4s' },
  { top: '68%', left: '48%', size: 'xs', twinkle: '4.5s' },
  { top: '70%', left: '84%', size: 'md', twinkle: '0.4s' },
  { top: '78%', left: '10%', size: 'xs', twinkle: '3.1s' },
  { top: '82%', left: '38%', size: 'sm', twinkle: '1.6s' },
  { top: '80%', left: '64%', size: 'xs', twinkle: '2.9s' },
  { top: '86%', left: '90%', size: 'sm', twinkle: '1.3s' },
  { top: '92%', left: '26%', size: 'xs', twinkle: '0.5s' },
  { top: '94%', left: '56%', size: 'md', twinkle: '3.7s' },
  { top: '90%', left: '78%', size: 'xs', twinkle: '2.2s' },
];

const CONSTELLATIONS = [
  {
    id: 'c1',
    top: '14%',
    left: '58%',
    points: [[0, 0], [28, 14], [46, -6], [72, 8], [58, 38]],
  },
  {
    id: 'c2',
    top: '62%',
    left: '16%',
    points: [[0, 0], [18, 22], [42, 16], [36, -10], [64, 4]],
  },
];

const ORBITS = [
  { top: '50%', left: '50%', w: 1100, h: 380, tilt: -18, duration: '60s', satellite: '#e2e8f0' },
  { top: '30%', left: '78%', w: 620, h: 240, tilt: 34, duration: '45s', satellite: '#2dd4bf' },
  { top: '74%', left: '22%', w: 480, h: 200, tilt: -50, duration: '38s', satellite: '#e2e8f0' },
];

const DISCOVERY_BLIPS = [
  { top: '22%', left: '18%', delay: '0s', size: 'sm' },
  { top: '38%', left: '76%', delay: '1.6s', size: 'md' },
  { top: '58%', left: '12%', delay: '3.2s', size: 'md' },
  { top: '74%', left: '68%', delay: '4.8s', size: 'sm' },
  { top: '46%', left: '42%', delay: '6.4s', size: 'lg' },
  { top: '88%', left: '32%', delay: '8s', size: 'sm' },
];

const SIZE_MAP = {
  xs: { dot: 'h-0.5 w-0.5', ring: '-inset-1.5' },
  sm: { dot: 'h-1 w-1', ring: '-inset-2' },
  md: { dot: 'h-1.5 w-1.5', ring: '-inset-3' },
  lg: { dot: 'h-2 w-2', ring: '-inset-4' },
};

export const BlogBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgba(45,212,191,0.02)_3px,rgba(45,212,191,0.02)_4px)]" />

    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,11,20,0.7)_100%)]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#2dd4bf_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />

    <div className="absolute top-[-20%] left-[-10%] h-150 w-150 rounded-full bg-[#1E293B]/20 blur-[120px]" />
    <div className="absolute right-[-15%] bottom-[-10%] h-175 w-175 rounded-full bg-[#2dd4bf]/8 blur-[140px]" />
    <div className="absolute top-1/2 left-1/3 h-100 w-225 -translate-y-1/2 -rotate-12 rounded-full bg-[#e2e8f0]/3 blur-[100px]" />

    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(226,232,240,0.06)_48%,rgba(226,232,240,0.03)_52%,transparent_60%)]" />
    </div>

    {STARS.map((star, i) => {
      const s = SIZE_MAP[star.size as keyof typeof SIZE_MAP];
      return (
        <span
          key={`star-${i}`}
          className={`absolute rounded-full bg-[#e2e8f0] shadow-[0_0_3px_rgba(226,232,240,0.6)] animate-[star-twinkle_6s_ease-in-out_infinite] motion-reduce:opacity-60 ${s.dot}`}
          style={{ top: star.top, left: star.left, animationDelay: star.twinkle }}
        />
      );
    })}

    {CONSTELLATIONS.map((c) => (
      <svg
        key={c.id}
        className="absolute h-40 w-40 text-[#2dd4bf]/40 sm:h-52 sm:w-52"
        viewBox="-10 -20 100 80"
        style={{ top: c.top, left: c.left }}
        aria-hidden
      >
        <polyline
          points={c.points.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="1 2"
        />
        {c.points.map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r="0.8" fill="#e2e8f0" opacity="0.85" />
        ))}
      </svg>
    ))}

    {ORBITS.map((orbit, i) => (
      <div
        key={`orbit-${i}`}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          top: orbit.top,
          left: orbit.left,
          width: orbit.w,
          height: orbit.h,
          transform: `translate(-50%, -50%) rotate(${orbit.tilt}deg)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full border border-dashed border-[#2dd4bf]/20"
          style={{ animation: `orbit-drift ${orbit.duration} linear infinite` }}
        />
        <div
          className="absolute inset-0"
          style={{ animation: `orbit-rotate ${orbit.duration} linear infinite` }}
        >
          <span
            className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              backgroundColor: orbit.satellite,
              boxShadow: `0 0 8px ${orbit.satellite}, 0 0 16px ${orbit.satellite}80`,
            }}
          />
        </div>
      </div>
    ))}

    <div className="absolute inset-x-0 top-1/3 opacity-60 motion-reduce:hidden">
      <div className="absolute h-px w-32 animate-[comet-fly_16s_linear_infinite] bg-linear-to-r from-transparent via-[#e2e8f0] to-transparent shadow-[0_0_6px_rgba(226,232,240,0.6)]" />
      <div
        className="absolute h-px w-24 animate-[comet-fly_22s_linear_infinite] bg-linear-to-r from-transparent via-[#e2e8f0]/70 to-transparent shadow-[0_0_4px_rgba(226,232,240,0.4)]"
        style={{ animationDelay: '8s', top: '120px' }}
      />
    </div>

    <div className="absolute bottom-0 left-1/2 h-200 w-200 -translate-x-1/2 translate-y-1/2">
      <div className="absolute inset-0 rounded-full border border-[#2dd4bf]/12" />
      <div className="absolute inset-24 rounded-full border border-[#2dd4bf]/10" />
      <div className="absolute inset-48 rounded-full border border-[#2dd4bf]/8" />
      <div className="absolute inset-72 rounded-full border border-[#2dd4bf]/6" />
      <div className="absolute inset-0 animate-[discovery-sweep_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(45,212,191,0.12)_24deg,rgba(45,212,191,0.02)_48deg,transparent_72deg)] motion-reduce:hidden" />
    </div>

    <div className="absolute top-1/4 right-0 h-125 w-125 translate-x-1/3 -translate-y-1/3">
      <div className="absolute inset-0 rounded-full border border-[#2dd4bf]/8" />
      <div className="absolute inset-20 rounded-full border border-[#2dd4bf]/6" />
      <div className="absolute inset-0 animate-[discovery-sweep_20s_linear_infinite_reverse] rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,rgba(45,212,191,0.08)_20deg,transparent_44deg)] motion-reduce:hidden" />
    </div>

    {DISCOVERY_BLIPS.map((blip, i) => {
      const s = SIZE_MAP[blip.size as keyof typeof SIZE_MAP];
      return (
        <div key={i} className="absolute" style={{ top: blip.top, left: blip.left }}>
          <span
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2e8f0] shadow-[0_0_8px_rgba(226,232,240,0.7),0_0_16px_rgba(226,232,240,0.35)] animate-[discovery-blink_8s_ease-in-out_infinite] motion-reduce:opacity-40 ${s.dot}`}
            style={{ animationDelay: blip.delay }}
          />
          <span
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e2e8f0]/50 animate-[discovery-ping_8s_ease-out_infinite] motion-reduce:hidden ${s.ring}`}
            style={{ animationDelay: blip.delay }}
          />
          <span
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2dd4bf]/30 animate-[discovery-ping_8s_ease-out_infinite] motion-reduce:hidden ${s.ring}`}
            style={{ animationDelay: `calc(${blip.delay} + 0.6s)` }}
          />
        </div>
      );
    })}

    <div className="absolute top-2/3 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 opacity-30">
      <div className="absolute inset-0 animate-[discovery-pulse_8s_ease-out_infinite] rounded-full border border-[#2dd4bf]/40 motion-reduce:hidden" />
      <div
        className="absolute inset-0 animate-[discovery-pulse_8s_ease-out_infinite] rounded-full border border-[#2dd4bf]/40 motion-reduce:hidden"
        style={{ animationDelay: '2.6s' }}
      />
      <div
        className="absolute inset-0 animate-[discovery-pulse_8s_ease-out_infinite] rounded-full border border-[#2dd4bf]/40 motion-reduce:hidden"
        style={{ animationDelay: '5.2s' }}
      />
    </div>

    {CROSSHAIRS.map((pos) => (
      <div key={pos} className={`absolute ${pos} h-4 w-4`}>
        <div className="absolute top-1/2 left-0 h-px w-full bg-[#2dd4bf]/30" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-[#2dd4bf]/30" />
      </div>
    ))}

    <div className="absolute top-1/2 left-3 -translate-y-1/2 rotate-180 font-mono text-[8px] tracking-[0.3em] text-[#2dd4bf]/20 uppercase [writing-mode:vertical-rl]">
      0x7F.DEEP.SPACE //// SECTOR.07
    </div>
    <div className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[8px] tracking-[0.3em] text-[#2dd4bf]/20 uppercase [writing-mode:vertical-rl]">
      RA 14h39m36s // DEC -60°50′02″
    </div>

    <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-widest text-[#2dd4bf]/30 uppercase md:flex">
      <span className="flex items-center gap-1.5">
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#e2e8f0] shadow-[0_0_4px_rgba(226,232,240,0.8)]" />
        SCAN.ACTIVE
      </span>
      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
      <span>6 SIGNALS IN RANGE</span>
      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
      <span>FREQ 14.250 MHz</span>
      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
      <span>DIST 42.7 AU</span>
    </div>
  </div>
);