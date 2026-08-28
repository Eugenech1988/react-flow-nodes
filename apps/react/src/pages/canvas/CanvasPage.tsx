import { useState } from 'react';
import { Canvas } from '@/widgets/canvas';
import { Sidebar } from '@/widgets/sidebar';
import { usePipelines } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui';
import { Navigate } from 'react-router-dom';

export const CanvasPage = () => {
  const { pipelines, isLoading } = usePipelines();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (!pipelines || pipelines.length === 0) {
    return <Navigate to="/pipelines" replace />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 h-full min-w-0 transition-all duration-300">
        <Canvas />
      </div>
    </div>
  );
};