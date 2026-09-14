import { Canvas } from '@/widgets/canvas';
import { usePipelines } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui';
import { Navigate } from 'react-router-dom';

export const CanvasPage = () => {
  const { pipelines, isLoading } = usePipelines();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (!pipelines || pipelines.length === 0) {
    return <Navigate to="/pipelines" replace />;
  }

  return <Canvas />;
};