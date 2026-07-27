import Logo from '@/assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/shared/ui';

export const NotFoundPage = () => {
  const navigate = useNavigate();
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
          <SubmitButton
            isPending={false}
            text='Back to App'
            onClick={() => {navigate('/')}}
          />
        </div>
      </div>
    </div>
  );
};