import Logo from '@/assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@/shared/ui';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-4 transition-colors">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 opacity-85">
          <img src={Logo} alt="Logo" className="mx-auto h-20 w-20" />
        </div>

        <h1 className="mb-2 text-6xl font-black tracking-tight">404</h1>
        <h2 className="mb-3 text-xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <AppButton text="Back to App" variant="primary" size="md" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};
