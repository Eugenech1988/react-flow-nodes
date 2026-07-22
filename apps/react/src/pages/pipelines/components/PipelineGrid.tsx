import { AnimatePresence } from 'framer-motion';
import { PipelineCard } from './PipelineCard';
import { EmptyState } from './EmptyState';
import { usePipelines } from '@/shared/hooks/usePipeLines.tsx';

interface PipelineGridProps {
  onDelete: (id: string) => void;
  searchQuery: string;
}

export const PipelineGrid = ({ onDelete, searchQuery }: PipelineGridProps) => {
  const { pipelines } = usePipelines();
  if (pipelines.length === 0) {
    return <EmptyState hasSearchQuery={searchQuery.length > 0} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {pipelines.map((pipeline) => (
          <PipelineCard key={pipeline.id} pipeline={pipeline} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
};