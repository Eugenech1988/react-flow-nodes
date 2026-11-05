import type { LucideIcon } from 'lucide-react';

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
      <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />

      <div className="mb-5 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/70 bg-linear-to-br from-[#123332] to-[#06100f] shadow-[inset_0_1px_0_rgba(94,234,212,0.25),0_0_15px_rgba(45,212,191,0.2)] sm:h-16 sm:w-16">
            <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/30" />
            <Icon className="h-6 w-6 text-[#5eead4] drop-shadow-[0_0_5px_rgba(45,212,191,0.7)] sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[9px] tracking-[0.3em] text-[#2dd4bf]/60 uppercase sm:text-[10px]">
              № {number}
            </div>
            <h3 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">{title}</h3>
          </div>
        </div>

        <div className="relative shrink-0 bg-[#2dd4bf]/40 p-px shadow-[0_4px_12px_rgba(0,0,0,0.5)] [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,8px_100%,0_50%)]">
          <div className="relative flex items-center justify-center gap-2 bg-[#0a1615] px-6 py-1.5 font-mono text-[10px] tracking-[0.15em] text-[#5eead4] uppercase [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,8px_100%,0_50%)]">
            <span className="absolute top-1/2 left-2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
            <span className="absolute top-1/2 right-2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_5px_#2dd4bf]" />
            <span className="h-3 w-px bg-[#2dd4bf]/30" />
            {badge}
          </div>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed text-[#8db8b4] sm:text-base"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
