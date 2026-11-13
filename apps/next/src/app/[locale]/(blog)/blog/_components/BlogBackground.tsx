type TStarSize = 'xs' | 'sm' | 'md' | 'lg';

interface IStar {
  top: string;
  left: string;
  size: TStarSize;
  twinkle: string;
}

interface IOrbit {
  top: string;
  left: string;
  w: string;
  h: string;
  tilt: number;
  duration: string;
  satellite: string;
}

const STARS: IStar[] = [
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
];

const ORBITS: IOrbit[] = [
  {
    top: '50%',
    left: '50%',
    w: 'w-[300px] sm:w-[700px] lg:w-[1100px]',
    h: 'h-[120px] sm:h-[240px] lg:h-[380px]',
    tilt: -18,
    duration: '60s',
    satellite: 'var(--theme-fg)',
  },
  {
    top: '30%',
    left: '78%',
    w: 'w-[250px] sm:w-[450px] lg:w-[620px]',
    h: 'h-[90px] sm:h-[180px] lg:h-[240px]',
    tilt: 34,
    duration: '45s',
    satellite: 'var(--theme-accent)',
  },
];

const SIZE_MAP: Record<TStarSize, { dot: string; ring: string }> = {
  xs: { dot: 'h-0.5 w-0.5', ring: '-inset-1.5' },
  sm: { dot: 'h-1 w-1', ring: '-inset-2' },
  md: { dot: 'h-1.5 w-1.5', ring: '-inset-3' },
  lg: { dot: 'h-2 w-2', ring: '-inset-4' },
};

export const BlogBackground = () => (
  <div className="bg-theme-bg pointer-events-none fixed inset-0 z-0 w-full overflow-hidden">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,color-mix(in_oklab,var(--theme-fg)_1.5%,transparent)_3px,color-mix(in_oklab,var(--theme-fg)_1.5%,transparent)_4px)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,color-mix(in_oklab,var(--theme-bg)_95%,transparent)_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--theme-line)_1px,transparent_0)] bg-size-[22px_22px] opacity-20" />

    <div className="bg-theme-line/10 absolute top-[-10%] left-[-10%] h-80 w-80 rounded-full blur-[100px] sm:h-125 sm:w-125" />
    <div className="bg-theme-accent/5 absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full blur-[120px] sm:h-150 sm:w-150" />

    {STARS.map((star, i) => {
      const s = SIZE_MAP[star.size];
      return (
        <span
          key={`star-${i}`}
          className={`bg-theme-fg absolute animate-[star-twinkle_6s_ease-in-out_infinite] rounded-full shadow-[0_0_3px_color-mix(in_oklab,var(--theme-fg)_60%,transparent)] motion-reduce:opacity-60 ${s.dot}`}
          style={{ top: star.top, left: star.left, animationDelay: star.twinkle }}
        />
      );
    })}

    {ORBITS.map((orbit, i) => (
      <div
        key={`orbit-${i}`}
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${orbit.w} ${orbit.h}`}
        style={{
          top: orbit.top,
          left: orbit.left,
          transform: `translate(-50%, -50%) rotate(${orbit.tilt}deg)`,
        }}
      >
        <div
          className="border-theme-accent/10 absolute inset-0 rounded-full border border-dashed"
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
              boxShadow: `0 0 8px ${orbit.satellite}, 0 0 16px ${orbit.satellite}`,
            }}
          />
        </div>
      </div>
    ))}

    <div className="absolute bottom-0 left-1/2 h-125 w-125 -translate-x-1/2 translate-y-1/2 sm:h-175 sm:w-175">
      <div className="border-theme-accent/10 absolute inset-0 rounded-full border" />
      <div className="border-theme-accent/10 absolute inset-16 rounded-full border" />
      <div className="absolute inset-0 animate-[discovery-sweep_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--theme-accent)_8%,transparent)_24deg,transparent_72deg)] motion-reduce:hidden" />
    </div>
  </div>
);
