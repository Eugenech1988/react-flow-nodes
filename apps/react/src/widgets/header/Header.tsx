import { Save, Sparkles } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '@/features/theme-toggle';
import logo from '@/assets/logo.svg';
import { useMutation } from '@tanstack/react-query';
import { trpcClient } from '@/shared/api';
import { UserDropdown } from '@/features/user-dropdown';
import { WorkflowExecutionControl } from '@/widgets/header/components/WorkflowExecutionControl';
import { ShareDialog } from '@/widgets/header/components/ShareDialog';
import { useUser } from '@/shared/hooks';
import { useStore } from '@/entities';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user } = useUser();
  const currentPipelineName = user?.currentPipeline?.name;

  const triggerSave = useStore((state) => state.triggerSave);

  const testMutation = useMutation({
    mutationFn: (message: string) =>
      trpcClient.ai.test.mutate({
        message,
      }),
    onSuccess: (data) => console.log(data),
  });

  const handleHeaderClick = () => {
    if (!isHome) {
      navigate('/');
    }
  };

  const handleAiClick = () => {
    testMutation.mutate('hello gemini');
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
        {currentPipelineName && (
          <>
            <div className="bg-border h-4 w-px" />
            <div className="flex items-center gap-2">
              <span className="text-foreground truncate text-sm font-medium">
                {currentPipelineName}
              </span>
              {/*<CloudCheck className="w-4 h-4 text-muted-foreground shrink-0"/>*/}
            </div>
          </>
        )}
      </div>

      <div className="flex w-[320px] items-center justify-end gap-3" onClick={preventNavigation}>
        {currentPipelineName && <WorkflowExecutionControl />}
        <ShareDialog />

        <button
          className="text-foreground/70 hover:text-foreground hover:bg-foreground/3 hover:border-border cursor-pointer rounded-md border border-transparent p-2 transition-all"
          onClick={triggerSave}
        >
          <Save className="h-4 w-4" />
        </button>

        <button
          onClick={handleAiClick}
          className="text-foreground/70 hover:text-foreground hover:bg-foreground/3 hover:border-border cursor-pointer rounded-md border border-transparent p-2 transition-all"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        <ThemeToggle />

        <div className="bg-border h-4 w-px" />

        <UserDropdown />
      </div>
    </header>
  );
};
