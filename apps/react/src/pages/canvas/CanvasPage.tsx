import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { usePipelines } from '@/entities';
import { usePipelineHandler } from '@/features/manage-pipelines';
import { useUser } from '@/shared/hooks';
import { Canvas } from '@/widgets/canvas';

export const CanvasPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedPipelineId = searchParams.get('pipeline');
  const { pipelines, isLoading } = usePipelines();
  const { user } = useUser();
  const processedRef = useRef<string | null>(null);

  const { setCurrentPipeline } = usePipelineHandler({
    onSetCurrentSuccess: () => {
      setSearchParams({}, { replace: true });
    },
  });

  useEffect(() => {
    if (!sharedPipelineId) return;
    if (isLoading) return;
    if (processedRef.current === sharedPipelineId) return;

    processedRef.current = sharedPipelineId;

    if (user?.currentPipelineId === sharedPipelineId) {
      setSearchParams({}, { replace: true });
      return;
    }

    const pipeline = pipelines.find((p) => p.id === sharedPipelineId);
    if (!pipeline) {
      toast.error('Pipeline not found or you do not have access to it.');
      setSearchParams({}, { replace: true });
      return;
    }

    setCurrentPipeline.mutate(pipeline);
  }, [
    sharedPipelineId,
    isLoading,
    pipelines,
    user?.currentPipelineId,
    setCurrentPipeline,
    setSearchParams,
  ]);

  if (isLoading || setCurrentPipeline.isPending) return null;

  if (!pipelines || pipelines.length === 0) {
    return <Navigate to="/pipelines" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative h-full w-full flex-1 overflow-hidden"
    >
      <Canvas />
    </motion.div>
  );
};
