import Logo from '@/assets/logo.svg';

export const GlobalLoader = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img src={Logo} alt="Workspace Logo" className="w-24 h-24" />
        </div>
      </div>
    </div>
  );
};