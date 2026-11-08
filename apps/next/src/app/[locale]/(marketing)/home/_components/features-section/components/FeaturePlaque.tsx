import type { LucideIcon } from 'lucide-react';
import { Rivets, CutoutBadge, TechLabel } from '@/shared/ui';

interface IPlaqueProps {
  title: string;
  badge: string;
  description: string;
  Icon: LucideIcon;
  number: string;
}

export const FeaturePlaque = ({ title, badge, description, Icon, number }: IPlaqueProps) => {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#2dd4bf]/40 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.12),0_8px_24px_rgba(0,0,0,0.5)] sm:p-8">
      <Rivets className="bg-[#5eead4]/40" />

      <div className="mb-5 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/70 bg-linear-to-br from-[#123332] to-[#06100f] shadow-[inset_0_1px_0_rgba(94,234,212,0.25),0_0_15px_rgba(45,212,191,0.2)] sm:h-16 sm:w-16">
            <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/30" />
            <Icon className="h-6 w-6 text-[#5eead4] drop-shadow-[0_0_5px_rgba(45,212,191,0.7)] sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <TechLabel className="text-[#2dd4bf]/60">№ {number}</TechLabel>
            <h3 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">{title}</h3>
          </div>
        </div>

        <CutoutBadge>{badge}</CutoutBadge>
      </div>

      <p
        className="text-sm leading-relaxed text-[#8db8b4] sm:text-base"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
