import { AnimatePresence } from 'framer-motion';
import { PipelineCard } from './PipelineCard';
import { EmptyState } from './EmptyState';
import type { TPipeline } from '@/entities';

interface PipelineGridProps {
  pipelines: TPipeline[];
  searchQuery: string;
  totalPipelinesCount: number;
}

export const PipelineGrid = ({
  pipelines,
  searchQuery,
  totalPipelinesCount,
}: PipelineGridProps) => {
  if (pipelines.length === 0) {
    return (
      <EmptyState
        hasSearchQuery={searchQuery.length > 0}
        isTotalEmpty={totalPipelinesCount === 0}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {pipelines.map((pipeline) => (
          <PipelineCard key={pipeline.id} pipeline={pipeline} />
        ))}
      </AnimatePresence>
    </div>
  );
};
