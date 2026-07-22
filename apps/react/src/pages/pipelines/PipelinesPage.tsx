import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelinesFilter } from './hooks/usePipelinesFilter';
import { MOCK_PIPELINES } from './constants';
import { PipelineHeader } from './components/PipelineHeader';
import { PipelineSearchAndFilter } from './components/PipelineSearchAndFilter';
import { PipelineGrid } from './components/PipelineGrid';
import type { Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.21, 1.02, 0.43, 1.01] },
  },
};

export const PipelinesPage = () => {
  const [pipelines, setPipelines] = useState(MOCK_PIPELINES);
  const { searchQuery, statusFilter, setStatusFilter, handleSearchChange, filteredPipelines } =
    usePipelinesFilter(pipelines);

  const handleDelete = (id: string) => {
    setPipelines((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <motion.div
      className="bg-background text-foreground p-4 md:p-6 transition-colors duration-300"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <PipelineHeader />
        <PipelineSearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <PipelineGrid
          pipelines={filteredPipelines}
          onDelete={handleDelete}
          searchQuery={searchQuery}
        />
      </div>
    </motion.div>
  );
};