export const CareersBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0,transparent_32px,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_32px,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_33px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,color-mix(in_oklab,var(--theme-bg)_55%,transparent)_100%)]" />
      <div className="bg-theme-accent/5 absolute top-0 left-1/2 h-200 w-250 -translate-x-1/2 rounded-full blur-[150px]" />

      <svg
        className="text-theme-accent absolute top-20 -right-32 h-150 w-150 opacity-[0.07]"
        viewBox="0 0 200 200"
        aria-hidden
      >
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {Array.from({ length: 20 }).map((_, i) => {
          const a = ((i * 18 - 90) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 75}
              y1={100 + Math.sin(a) * 75}
              x2={100 + Math.cos(a) * 82}
              y2={100 + Math.sin(a) * 82}
              stroke="currentColor"
              strokeWidth="1"
            />
          );
        })}
        <line x1="100" y1="100" x2="140" y2="60" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="4" fill="currentColor" />
      </svg>

      <div className="border-theme-accent/20 absolute top-6 left-6 h-12 w-12 border-t-2 border-l-2" />
      <div className="border-theme-accent/20 absolute top-6 right-6 h-12 w-12 border-t-2 border-r-2" />
      <div className="border-theme-accent/20 absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2" />
      <div className="border-theme-accent/20 absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2" />

      <div className="absolute top-0 bottom-0 left-3 flex w-1 flex-col justify-evenly">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={`l-${i}`}
            className="bg-theme-rivet h-1.5 w-1.5 rounded-full shadow-[inset_0_1px_1px_color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
          />
        ))}
      </div>

      <div className="absolute top-0 right-3 bottom-0 flex w-1 flex-col justify-evenly">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={`r-${i}`}
            className="bg-theme-rivet h-1.5 w-1.5 rounded-full shadow-[inset_0_1px_1px_color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
          />
        ))}
      </div>
    </div>
  );
};
