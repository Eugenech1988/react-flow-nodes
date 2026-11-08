import { LucideIcon } from 'lucide-react';

const TORN_BOTTOM =
  'polygon(0 0,100% 0,100% 94%,96% 100%,92% 94%,88% 100%,84% 94%,80% 100%,76% 94%,72% 100%,68% 94%,64% 100%,60% 94%,56% 100%,52% 94%,48% 100%,44% 94%,40% 100%,36% 94%,32% 100%,28% 94%,24% 100%,20% 94%,16% 100%,12% 94%,8% 100%,4% 94%,0 100%)';

interface ITornPaperCardProps {
  title: string;
  description: string;
  number: string;
  Icon: LucideIcon;
  badge: string;
}

export const TornPaperCard = ({ title, description, number, Icon, badge }: ITornPaperCardProps) => (
  <div className="relative overflow-hidden bg-[#e8dcc8] text-[#2a2218]" style={{ clipPath: TORN_BOTTOM }}>
    <div className="flex justify-around border-b border-dashed border-[#8a7a5c]/40 bg-[#d4c9b0] px-3 py-1.5">
      {Array.from({ length: 10 }).map((_, j) => (
        <span key={j} className="h-1.5 w-1.5 rounded-full bg-[#4a3f2e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      ))}
    </div>

    <div className="px-5 pt-5 pb-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl leading-none font-bold text-[#8a2e2e]">{number}</span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#8a7a5c] uppercase">{badge}</span>
        </div>
        <Icon className="h-5 w-5 text-[#4a3f2e]/70" />
      </div>

      <h3 className="font-serif text-lg font-bold tracking-wide text-[#2a2218] sm:text-xl">{title}</h3>
      <p className="mt-2 font-serif text-sm leading-relaxed text-[#4a3f2e]/85">{description}</p>
    </div>

    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(138,122,92,0.15),transparent_60%)]" />
  </div>
);