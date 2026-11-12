import { ReactNode } from 'react';

const CHAMFER_OUTER =
  'polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0 calc(100% - 16px),0 16px)';
const CHAMFER_INNER =
  'polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px)';

interface IChamferedCardProps {
  children: ReactNode;
  className?: string;
}

export const ChamferedCard = ({ children, className }: IChamferedCardProps) => (
  <div className={className}>
    <div
      className="from-theme-line-strong via-theme-line to-theme-panel bg-linear-to-b p-px"
      style={{ clipPath: CHAMFER_OUTER }}
    >
      <div
        className="from-theme-surface to-theme-bg relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-b px-4 py-6 sm:py-7"
        style={{ clipPath: CHAMFER_INNER }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_2px,color-mix(in_oklab,var(--theme-accent)_4%,transparent)_2px,color-mix(in_oklab,var(--theme-accent)_4%,transparent)_3px)]" />
        <div className="relative z-10 w-full">{children}</div>
        <div className="border-theme-accent/40 pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-dashed" />
        <div className="border-theme-accent/40 pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-dashed" />
        <div className="via-theme-accent-hover/30 pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
      </div>
    </div>
  </div>
);
