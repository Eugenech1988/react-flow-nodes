import { AnimatePresence } from 'framer-motion';
import { PipelineCard } from '@/pages/pipelines/components/PipelineCard';
import { EmptyState } from '@/pages/pipelines/components/EmptyState';
import type { TPipeline } from '@/shared/lib';

interface PipelineGridProps {
  pipelines: TPipeline[];
  searchQuery: string;
  /** Общее количество пайплайнов до примененных фильтров и поиска */
  totalPipelinesCount: number;
}

export const PipelineGrid = ({
                               pipelines,
                               searchQuery,
                               totalPipelinesCount
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {pipelines.map((pipeline) => (
          <PipelineCard key={pipeline.id} pipeline={pipeline} />
        ))}
      </AnimatePresence>
    </div>
  );
};