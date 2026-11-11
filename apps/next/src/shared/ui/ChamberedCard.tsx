import { ReactNode } from 'react';

const CHAMFER_OUTER =
  'polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0 calc(100% - 16px),0 16px)';
const CHAMFER_INNER =
  'polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px)';

interface IChamferedCardProps {
  children: ReactNode;
  className?: string;
}

export const ChamberedCard = ({ children, className }: IChamferedCardProps) => (
  <div className={className}>
    <div
      className="bg-linear-to-b from-[#4a5c52] via-[#2f3d36] to-[#1a2420] p-px"
      style={{ clipPath: CHAMFER_OUTER }}
    >
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#141a16] to-[#0a0e0d] px-4 py-6 sm:py-7"
        style={{ clipPath: CHAMFER_INNER }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_2px,rgba(111,162,140,0.04)_2px,rgba(111,162,140,0.04)_3px)]" />
        <div className="relative z-10 w-full">{children}</div>
        <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-dashed border-[#6fa28c]/40" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-dashed border-[#6fa28c]/40" />
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-[#9cc4b0]/30 to-transparent" />
      </div>
    </div>
  </div>
);
