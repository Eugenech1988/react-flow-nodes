import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { Toaster } from '@pipeline/ui';
import { ReactFlowProvider } from '@xyflow/react';

export const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen h-screen bg-background text-foreground overflow-hidden">
      <ReactFlowProvider>
        <Header />

        <div className="flex flex-1 pt-14 h-full w-full overflow-hidden">
          <Sidebar />

          <main className="flex-1 h-full min-w-0 transition-all duration-300 relative">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </ReactFlowProvider>
    </div>
  );
};