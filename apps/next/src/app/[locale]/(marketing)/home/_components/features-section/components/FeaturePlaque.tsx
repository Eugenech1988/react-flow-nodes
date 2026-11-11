import type { LucideIcon } from 'lucide-react';
import { Rivets, Badge, TechLabel } from '@/shared/ui';

interface IFeaturePlaqueProps {
  title: string;
  badge: string;
  description: string;
  Icon: LucideIcon;
  number: string;
}

export const FeaturePlaque = ({ title, badge, description, Icon, number }: IFeaturePlaqueProps) => {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#2dd4bf]/40 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] p-5 shadow-[inset_0_1px_0_rgba(45,212,191,0.12),0_8px_24px_rgba(0,0,0,0.5)] sm:p-8">
      <Rivets className="bg-[#5eead4]/40" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/70 bg-linear-to-br from-[#123332] to-[#06100f] shadow-[inset_0_1px_0_rgba(94,234,212,0.25),0_0_15px_rgba(45,212,191,0.2)] sm:h-16 sm:w-16">
            <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/30" />
            <Icon className="h-5 w-5 text-[#5eead4] drop-shadow-[0_0_5px_rgba(45,212,191,0.7)] sm:h-7 sm:w-7" />
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <TechLabel className="mb-1 text-[10px] text-[#2dd4bf]/60 sm:text-xs">
              № {number}
            </TechLabel>
            <h3 className="text-lg leading-tight font-bold text-[#d1faf5] sm:text-xl md:text-2xl">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex">
          <Badge variant="hex" className="text-[10px] sm:text-xs">{badge}</Badge>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed text-[#8db8b4] sm:text-base"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
