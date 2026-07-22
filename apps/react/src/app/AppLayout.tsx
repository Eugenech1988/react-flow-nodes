import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Toaster } from '@pipeline/ui';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 min-h-0">
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}

export default AppLayout;