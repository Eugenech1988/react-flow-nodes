import { Camera, Cloud, CloudAlert, CloudCheck, Save, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '@/features/theme-toggle';
import logo from '@/assets/logo.svg';
import { UserDropdown } from '@/features/user-dropdown';
import { WorkflowExecutionControl } from './components/WorkflowExecutionControl';
import { ShareDialog } from '@/widgets';
import { useUser } from '@/shared/hooks';
import { useStore } from '@/entities';
import { SidebarToggle } from '@/widgets/sidebar/components/SidebarToggle';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, role } = useUser();
  const currentPipelineName = user?.currentPipeline?.name;

  const triggerSave = useStore((state) => state.triggerSave);
  const saveStatus = useStore((state) => state.saveStatus);

  const isContentManager = role === 'CONTENT_MANAGER';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = isContentManager || isSuperAdmin;
  const showPipelineControls = !isAdmin && Boolean(currentPipelineName);

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
      className="bg-background bg-header-bg border-border fixed top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b px-6 transition-colors duration-300"
      onClick={handleHeaderClick}
    >
      <div className="flex w-[320px] items-center gap-4" onClick={preventNavigation}>
        <Link to="/">
          <img className="h-6 w-auto object-contain" src={logo} alt="Pipeline logo" />
        </Link>

        <SidebarToggle />

        {isAdmin && (
          <>
            <div className="bg-border h-4 w-px" />
            <span
              title={`Signed in as ${isSuperAdmin ? 'Super Admin' : 'Content Manager'}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-teal-600 uppercase dark:text-teal-400"
            >
              <ShieldCheck className="h-3 w-3" />
              {isSuperAdmin ? 'Super Admin' : 'Content Manager'}
            </span>
          </>
        )}

        {showPipelineControls && (
          <>
            <div className="bg-border h-4 w-px" />
            <div className="flex items-center gap-2">
              <span className="text-foreground truncate text-sm font-medium">
                {currentPipelineName}
              </span>
              {saveStatus === 'saved' ? (
                <span title="Saved">
                  <CloudCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                </span>
              ) : saveStatus === 'error' ? (
                <span title="Save failed">
                  <CloudAlert className="text-destructive h-4 w-4 shrink-0" />
                </span>
              ) : (
                <span title={saveStatus === 'saving' ? 'Saving…' : 'Not saved'}>
                  <Cloud
                    className={`text-muted-foreground h-4 w-4 shrink-0 ${
                      saveStatus === 'saving' ? 'animate-pulse' : ''
                    }`}
                  />
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex w-[320px] items-center justify-end gap-3" onClick={preventNavigation}>
        {showPipelineControls && (
          <>
            <WorkflowExecutionControl />
            <ShareDialog />

            <button
              className="text-foreground/70 hover:text-foreground hover:bg-foreground/3 hover:border-border cursor-pointer rounded-md border border-transparent p-2 transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isHome}
              onClick={() => triggerSave(false, true)}
              title={!isHome ? 'Saving is only available on the canvas page' : 'Save pipeline'}
            >
              <Save className="h-4 w-4" />
            </button>

            <button
              className="text-foreground/70 hover:text-foreground hover:bg-foreground/3 hover:border-border cursor-pointer rounded-md border border-transparent p-2 transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isHome}
              onClick={() => triggerSave(true, true)}
              title={
                !isHome
                  ? 'Saving is only available on the canvas page'
                  : 'Center canvas and save screenshot'
              }
            >
              <Camera className="h-4 w-4" />
            </button>
          </>
        )}

        <ThemeToggle />

        <div className="bg-border h-4 w-px" />

        <UserDropdown />
      </div>
    </header>
  );
};
