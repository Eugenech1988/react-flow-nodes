import { RIVET_POSITIONS } from './constants';

export const Rivets = () => (
  <>
    {RIVET_POSITIONS.map((position) => (
      <span
        key={position}
        className={`pointer-events-none absolute ${position} z-20 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:h-2 sm:w-2`}
      />
    ))}
  </>
);

export const WindowDots = () => (
  <div className="flex gap-1.5">
    <span className="h-2 w-2 rounded-full bg-red-500/50" />
    <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
    <span className="h-2 w-2 rounded-full bg-green-500/50 shadow-[0_0_5px_#22c55e]" />
  </div>
);
