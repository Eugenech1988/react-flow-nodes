import { Cog, Settings2, Database } from 'lucide-react';

export function AboutBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute top-0 left-1/2 h-200 w-250 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-[150px]" />

      <div className="absolute -top-40 -left-40 opacity-5">
        <Cog className="h-200 w-200 text-[#2dd4bf]" strokeWidth={0.5} />
      </div>

      <div className="absolute top-1/3 -right-40 opacity-5">
        <Settings2 className="h-150 w-150 text-[#2dd4bf]" strokeWidth={0.5} />
      </div>

      <Database
        className="absolute bottom-20 left-10 h-100 w-100 text-[#2dd4bf] opacity-[0.02]"
        strokeWidth={0.5}
      />
    </div>
  );
}