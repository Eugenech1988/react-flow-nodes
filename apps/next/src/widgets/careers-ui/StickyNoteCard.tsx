import { Pin } from 'lucide-react';
import { PaperCard } from './PaperCard';

interface IStickyNoteCardProps {
  title: string;
  description: string;
  number: string;
}

export const StickyNoteCard = ({ title, description, number }: IStickyNoteCardProps) => (
  <div className="relative w-full">
    <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
      <div className="border-theme-line-strong from-theme-accent-hover to-theme-accent-deep flex h-7 w-7 items-center justify-center rounded-full border-2 bg-linear-to-b shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]">
        <Pin className="text-theme-bg h-3.5 w-3.5 rotate-45" />
      </div>
    </div>

    <PaperCard
      className="bg-paper-surface bg-[repeating-linear-gradient(transparent,transparent_27px,color-mix(in_oklab,var(--theme-accent)_22%,transparent)_27px,color-mix(in_oklab,var(--theme-accent)_22%,transparent)_28px)]"
      decor={
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--theme-paper-soft)_8%,transparent),transparent_50%)]" />
      }
    >
      <div className="bg-theme-bg absolute top-4 left-3 h-3 w-3 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      <div className="bg-theme-bg absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      <div className="bg-theme-bg absolute bottom-4 left-3 h-3 w-3 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      <div className="bg-theme-danger/50 absolute top-0 bottom-0 left-10 w-px sm:left-12" />

      <div className="px-6 pt-6 pb-7 pl-14 sm:px-10 sm:pt-8 sm:pb-9 sm:pl-16">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-paper-soft/70 font-caveat text-xl">{number}.</span>
        </div>

        <h3 className="text-paper-ink font-caveat text-3xl leading-tight font-bold sm:text-4xl">
          {title}
        </h3>
        <p className="text-paper-body/85 font-caveat mt-2 text-xl leading-relaxed sm:text-2xl">
          {description}
        </p>

        <svg className="text-paper-ink/40 mt-3 h-2 w-32" viewBox="0 0 120 8" aria-hidden>
          <path
            d="M 2 5 Q 30 2, 60 5 T 118 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </PaperCard>
  </div>
);
