import { LucideIcon } from 'lucide-react';
import { PaperCard } from './PaperCard';

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
  <PaperCard
    className="bg-paper-bg text-paper-fg"
    clipPath={TORN_BOTTOM}
    decor={
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--theme-paper-soft)_15%,transparent),transparent_60%)]" />
    }
  >
    <div className="border-paper-soft/40 bg-paper-panel flex justify-around border-b border-dashed px-3 py-1.5">
      {Array.from({ length: 10 }).map((_, j) => (
        <span
          key={j}
          className="bg-paper-muted h-1.5 w-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
        />
      ))}
    </div>

    <div className="px-5 pt-5 pb-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-paper-accent font-serif text-3xl leading-none font-bold">
            {number}
          </span>
          <span className="text-paper-soft font-mono text-[9px] tracking-[0.2em] uppercase">
            {badge}
          </span>
        </div>
        <Icon className="text-paper-muted/70 h-5 w-5" />
      </div>

      <h3 className="text-paper-fg font-serif text-lg font-bold tracking-wide sm:text-xl">
        {title}
      </h3>
      <p className="text-paper-muted/85 mt-2 font-serif text-sm leading-relaxed">{description}</p>
    </div>
  </PaperCard>
);
