// src/pages/pipelines/components/PipelineGrid.tsx
import { AnimatePresence } from 'framer-motion';
import { PipelineCard } from './PipelineCard';
import { EmptyState } from './EmptyState';
import type { IPipeline } from '../types';

interface PipelineGridProps {
  pipelines: IPipeline[];
  searchQuery: string;
}

export const PipelineGrid = ({ pipelines, searchQuery }: PipelineGridProps) => {
  if (pipelines.length === 0) {
    return <EmptyState hasSearchQuery={searchQuery.length > 0} />;
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