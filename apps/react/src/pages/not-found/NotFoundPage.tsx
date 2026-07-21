import { Link } from 'react-router-dom';
import { Button } from '@pipeline/ui';
import Logo from '@/assets/logo.svg';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 opacity-85">
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
        </div>

        <h1 className="text-6xl font-black mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold mb-3">Page not found</h2>
        <p className="text-sm mb-8 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="w-full">
          <Button
            className="cursor-pointer h-12 rounded-xl bg-teal-600 text-base font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] active:scale-[0.98] px-4"
          >
            <Link to="/">Back to Workspace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};