import { CloudCheck, Settings, Share2 } from 'lucide-react';
import { ThemeToggle } from '@/features/theme-toggle';
import logo from '@/assets/logo.svg';
import { UserDropdown } from '@/features/user-dropdown';
import { useUser } from '@/features/auth';

export const Header = () => {
  const { user } = useUser();
  return (
    <header className="flex h-14 w-full items-center justify-between px-6 bg-header-bg border-b border-border z-40 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <img className="h-6 w-auto object-contain" src={logo} alt="Pipeline logo" />
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">untitled_pipeline_1</span>
          <CloudCheck className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex bg-foreground/3 p-1 rounded-lg border border-border/50 text-sm">
        <button className="px-3 py-1 rounded-md bg-card text-foreground font-medium shadow-xs cursor-pointer">
          Editor
        </button>
        <button className="px-3 py-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer transition-colors">
          Executions
        </button>
        <button className="px-3 py-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer transition-colors">
          Tests
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium border border-border bg-card hover:bg-foreground/3 rounded-md cursor-pointer transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>

        <button className="p-2 text-foreground/70 hover:text-foreground hover:bg-foreground/3 border border-transparent hover:border-border rounded-md cursor-pointer transition-all">
          <Settings className="w-4 h-4" />
        </button>

        <ThemeToggle />

        <div className="h-4 w-px bg-border" />

        <UserDropdown />
      </div>
    </header>
  );
};