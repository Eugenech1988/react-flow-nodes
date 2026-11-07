import { cn } from '@/shared/lib';

interface IInfoBadgeProps {
  text?: string;
  className?: string;
  theme?: 'default' | 'steampunk';
}

export const InfoBadge = ({ text, className, theme = 'default' }: IInfoBadgeProps) => {
  const isSteampunk = theme === 'steampunk';

  return (
    <div
      className={cn(
        'relative flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white/5 px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md',
        {
          'border-teal-500/30': !isSteampunk,
          'rounded-sm border-[#6fa28c]/40 bg-[#0a0e0d]/80 shadow-[inset_0_1px_0_rgba(156,196,176,0.1),inset_0_-1px_2px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.6)]': isSteampunk,
        },
        className,
      )}
    >
      {/* Радиальный фон */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0',
          {
            'bg-[radial-gradient(circle_at_50%_120%,rgba(57,179,155,0.15),transparent_60%)]': !isSteampunk,
            'bg-[radial-gradient(circle_at_50%_120%,rgba(111,162,140,0.15),transparent_60%)]': isSteampunk,
          }
        )}
      />

      {/* Верхняя и нижняя линии */}
      <span
        className={cn(
          'pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent to-transparent',
          {
            'via-teal-300/40': !isSteampunk,
            'via-[#6fa28c]/40': isSteampunk,
          }
        )}
      />
      <span
        className={cn(
          'pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent to-transparent',
          {
            'via-teal-400/20': !isSteampunk,
            'via-[#6fa28c]/20': isSteampunk,
          }
        )}
      />

      {/* Винтики (4 шт) */}
      {[
        'top-1.25 left-1.25',
        'top-1.25 right-1.25',
        'bottom-1.25 left-1.25',
        'bottom-1.25 right-1.25',
      ].map((pos) => (
        <span
          key={pos}
          className={cn(
            `pointer-events-none absolute ${pos} z-10 h-1 w-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8)]`,
            {
              'bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]': !isSteampunk,
              'bg-[radial-gradient(circle_at_30%_30%,#d4cfc0,#9cc4b0_35%,#4a6d5e_70%,#2f3d36_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.9),0_0_5px_rgba(111,162,140,0.45)]': isSteampunk,
            }
          )}
        />
      ))}

      {/* Текст и пульсирующие точки */}
      <div className="relative z-20 flex items-center gap-3 px-1">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span
            className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', {
              'bg-teal-400': !isSteampunk,
              'bg-[#6fa28c]': isSteampunk,
            })}
          />
          <span
            className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', {
              'bg-teal-400 shadow-[0_0_6px_rgba(57,179,155,1)]': !isSteampunk,
              'bg-[#6fa28c] shadow-[0_0_6px_rgba(111,162,140,1)]': isSteampunk,
            })}
          />
        </span>

        <span
          className={cn(
            'text-[10px] font-bold tracking-[0.15em] uppercase',
            {
              'text-teal-300/90 drop-shadow-[0_0_4px_rgba(57,179,155,0.4)]': !isSteampunk,
              'font-typewriter text-[#9cc4b0] drop-shadow-[0_0_4px_rgba(111,162,140,0.4)]': isSteampunk,
            }
          )}
        >
          {text}
        </span>

        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span
            className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', {
              'bg-teal-400': !isSteampunk,
              'bg-[#6fa28c]': isSteampunk,
            })}
          />
          <span
            className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', {
              'bg-teal-400 shadow-[0_0_6px_rgba(57,179,155,1)]': !isSteampunk,
              'bg-[#6fa28c] shadow-[0_0_6px_rgba(111,162,140,1)]': isSteampunk,
            })}
          />
        </span>
      </div>
    </div>
  );
};