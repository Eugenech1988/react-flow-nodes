import { Save, Settings, Share2 } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '@/features/theme-toggle';
import logo from '@/assets/logo.svg';
import { UserDropdown } from '@/features/user-dropdown';
import { WorkflowExecutionControl } from '@/widgets/header/components/WorkflowExecutionControl';
import { useUser } from '@/shared/hooks';
import { useStore } from '@/entities';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const {user} = useUser();
  const currentPipelineName = user?.currentPipeline?.name;

  const triggerSave = useStore((state) => state.triggerSave);

  const handleHeaderClick = () => {
    if (!isHome) {
      navigate('/');
    }
  };

  const preventNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header
      className="flex h-14 fixed bg-background top-0 w-full items-center justify-between px-6 bg-header-bg border-b border-border z-40 shrink-0 transition-colors duration-300"
      onClick={handleHeaderClick}
    >
      <div className="flex items-center gap-4 w-[320px]" onClick={preventNavigation}>
        <Link to="/">
          <img className="h-6 w-auto object-contain" src={logo} alt="Pipeline logo"/>
        </Link>
        {currentPipelineName &&
          <>
            <div className="h-4 w-px bg-border"/>
            <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">
            {currentPipelineName}
          </span>
              {/*<CloudCheck className="w-4 h-4 text-muted-foreground shrink-0"/>*/}
            </div>
          </>
        }
      </div>

      <div className="flex items-center gap-3 w-[320px] justify-end" onClick={preventNavigation}>
        {currentPipelineName &&
          <WorkflowExecutionControl/>
        }
        <button
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium border border-border bg-card hover:bg-foreground/3 rounded-md cursor-pointer transition-colors">
          <Share2 className="w-3.5 h-3.5"/>
          Share
        </button>

        <button
          className="p-2 text-foreground/70 hover:text-foreground hover:bg-foreground/3 border border-transparent hover:border-border rounded-md cursor-pointer transition-all"
          onClick={triggerSave}
        >
          <Save className="w-4 h-4"/>
        </button>

        <button
          className="p-2 text-foreground/70 hover:text-foreground hover:bg-foreground/3 border border-transparent hover:border-border rounded-md cursor-pointer transition-all">
          <Settings className="w-4 h-4"/>
        </button>

        <ThemeToggle/>

        <div className="h-4 w-px bg-border"/>

        <UserDropdown/>
      </div>
    </header>
  );
};