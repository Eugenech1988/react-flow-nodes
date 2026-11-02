import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { Toaster } from '@pipeline/ui';
import { ReactFlowProvider } from '@xyflow/react';

export const AppLayout = () => {
  return (
    <div className="bg-background text-foreground flex h-screen min-h-screen flex-col overflow-hidden">
      <ReactFlowProvider>
        <Header />

        <div className="flex h-full w-full flex-1 overflow-hidden pt-14">
          <Sidebar />

          <main className="relative h-full min-w-0 flex-1 transition-all duration-300">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </ReactFlowProvider>
    </div>
  );
};
