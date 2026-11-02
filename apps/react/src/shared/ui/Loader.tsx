import Logo from '@/assets/logo.svg';

export const GlobalLoader = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center transition-colors">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img src={Logo} alt="Workspace Logo" className="h-24 w-24" />
        </div>
      </div>
    </div>
  );
};
