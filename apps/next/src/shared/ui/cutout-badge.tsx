export const CutoutBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="relative shrink-0 bg-[#2dd4bf]/30 p-px [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]">
    <div className="flex items-center justify-center bg-[#0a1615] px-4 py-1 font-mono text-[10px] tracking-widest text-[#2dd4bf] uppercase [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]">
      {children}
    </div>
  </div>
);
