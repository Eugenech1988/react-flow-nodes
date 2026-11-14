import Logo from '@/assets/logo.svg';
import { cn } from '@/shared/lib';

interface IGlobalLoaderProps {
  fullScreen?: boolean;
  className?: string;
}

export const GlobalLoader = ({ fullScreen = true, className }: IGlobalLoaderProps) => {
  return (
    <div
      className={cn(
        'bg-background flex items-center justify-center transition-colors',
        fullScreen ? 'min-h-screen' : 'h-full w-full',
        className,
      )}
    >
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img src={Logo} alt="Workspace Logo" className="h-24 w-24" />
        </div>
      </div>
    </div>
  );
};
