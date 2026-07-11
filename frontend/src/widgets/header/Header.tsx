import { ServerStatusBadge } from '@/features/check-status';
import { ThemeToggle } from '@/features/toggle-theme';
import { SubmitButton } from '@/features/submit-pipeline';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-[#f1f5f9] dark:bg-[#030712] border-b border-border/80 shadow-xs z-40 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3 select-none">
        <div data-testid="app-logo" className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 select-none overflow-hidden bg-white dark:bg-black border border-border/20">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1.5">
            <path d="M60 140V60H100C122.091 60 140 77.9086 140 100C140 122.091 122.091 140 100 140H60Z" fill="#38BDF8"/>
            <path d="M100 140L145 95" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M145 95L135 60" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-foreground">Pipeline Studio</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Drag, connect, and run your workflow
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ServerStatusBadge />
        <ThemeToggle />
        <SubmitButton />
      </div>
    </header>
  );
};