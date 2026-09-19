import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

import { usePipelines } from '@/shared/hooks';
import { Canvas } from '@/widgets/canvas';

export const CanvasPage = () => {
  const { pipelines, isLoading } = usePipelines();

  if (isLoading) return null;

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