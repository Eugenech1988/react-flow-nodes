import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { usePipelines } from '@/entities';
import type { TPipeline } from '@/entities';
import { usePipelineHandler } from '@/features/manage-pipelines';
import { useUser } from '@/shared/hooks';
import { GlobalLoader, ConfirmDialog } from '@/shared/ui';
import { Canvas } from '@/widgets/canvas';

export const CanvasPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedPipelineId = searchParams.get('pipeline');
  const { pipelines, isLoading } = usePipelines();
  const { user } = useUser();
  const processedRef = useRef<string | null>(null);
  const [pendingPipeline, setPendingPipeline] = useState<TPipeline | null>(null);

  const { setCurrentPipeline } = usePipelineHandler({
    onSetCurrentSuccess: () => {
      setPendingPipeline(null);
      setSearchParams({}, { replace: true });
    },
    onSetCurrentError: (error) => {
      setPendingPipeline(null);
      processedRef.current = null;
      toast.error(error.message || 'Failed to load pipeline. Please try again.');
      setSearchParams({}, { replace: true });
    },
  });

  useEffect(() => {
    if (processedRef.current && processedRef.current !== sharedPipelineId) {
      processedRef.current = null;
    }
  }, [sharedPipelineId]);

  useEffect(() => {
    if (!sharedPipelineId) return;
    if (isLoading) return;
    if (processedRef.current === sharedPipelineId) return;

    processedRef.current = sharedPipelineId;

    if (user?.currentPipelineId === sharedPipelineId) {
      setSearchParams({}, { replace: true });
      return;
    }

    const pipeline = pipelines.find((item) => item.id === sharedPipelineId);
    if (!pipeline) {
      toast.error('Pipeline not found or you do not have access to it.');
      setSearchParams({}, { replace: true });
      return;
    }

    setPendingPipeline(pipeline);
  }, [sharedPipelineId, isLoading, pipelines, user?.currentPipelineId, setSearchParams]);

  const handleConfirmSwitch = (): void => {
    if (pendingPipeline) setCurrentPipeline.mutate(pendingPipeline);
  };

  const handleCancelSwitch = (): void => {
    setPendingPipeline(null);
    setSearchParams({}, { replace: true });
  };

  if (isLoading || setCurrentPipeline.isPending) {
    return <GlobalLoader fullScreen={false} />;
  }

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

      <ConfirmDialog
        isOpen={Boolean(pendingPipeline)}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        isPending={setCurrentPipeline.isPending}
        title="Open shared pipeline?"
        message={
          <>
            This will set <strong>&quot;{pendingPipeline?.name}&quot;</strong> as your active
            pipeline. Unsaved changes on your current canvas will be discarded.
          </>
        }
        submitText="Open"
        pendingText="Opening..."
        cancelText="Cancel"
        variant="primary"
      />
    </motion.div>
  );
};