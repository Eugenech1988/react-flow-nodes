import type { LucideIcon } from 'lucide-react';
import { Rivets, Badge, TechLabel } from '@/shared/ui';

interface IFeaturePlaqueProps {
  title: string;
  badge: string;
  description: string;
  Icon: LucideIcon;
  number: string;
}

export const FeaturePlaque = ({ title, badge, description, Icon, number }: IFeaturePlaqueProps) => (
  <div className="border-theme-accent/40 from-theme-raised via-theme-surface to-theme-bg relative flex w-full flex-col overflow-hidden rounded-3xl border bg-linear-to-br p-5 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent)_12%,transparent),0_8px_24px_rgba(0,0,0,0.5)] sm:p-8">
    <Rivets className="bg-theme-accent-hover/40" />

    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="border-theme-accent/70 from-theme-raised to-theme-bg relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_25%,transparent),0_0_15px_color-mix(in_oklab,var(--theme-accent)_20%,transparent)] sm:h-16 sm:w-16">
          <div className="border-theme-accent/30 absolute inset-1 rounded-full border" />
          <Icon className="text-theme-accent-hover h-5 w-5 drop-shadow-[0_0_5px_color-mix(in_oklab,var(--theme-accent)_70%,transparent)] sm:h-7 sm:w-7" />
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <TechLabel className="text-theme-accent/60 mb-1 text-[10px] sm:text-xs">
            № {number}
          </TechLabel>
          <h3 className="text-theme-fg text-lg leading-tight font-bold sm:text-xl md:text-2xl">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex">
        <Badge variant="hex" className="text-[10px] sm:text-xs">
          {badge}
        </Badge>
      </div>
    </div>

    <p
      className="text-theme-muted text-sm leading-relaxed sm:text-base"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
);
