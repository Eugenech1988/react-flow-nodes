import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelines } from '@/shared/hooks';
import { usePipelinesFilter } from './hooks';
import { PAGE_VARIANTS } from '@/shared/lib';
import { PipelineHeader, PipelineSearchAndFilter, PipelineGrid } from './components';
import type { TPipeline } from '@/shared/lib';
import { CreatePipelineDialog } from '@/pages/pipelines/components';

export const PipelinesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { pipelines } = usePipelines();

  const {
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleSearchChange,
    setStatusFilter,
    filteredPipelines,
  } = usePipelinesFilter((pipelines || []) as unknown as TPipeline[]);

  return (
    <motion.div
      className="bg-background text-foreground p-4 md:p-6 transition-colors duration-300"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <PipelineHeader
          setIsCreateOpen={setIsCreateOpen}
        />
        <PipelineSearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(by, order) => {
            setSortBy(by);
            setSortOrder(order);
          }}
        />
        <PipelineGrid setIsCreateOpen={setIsCreateOpen} pipelines={filteredPipelines} searchQuery={searchQuery} />
        <CreatePipelineDialog isOpen={isCreateOpen} onClose={() => {setIsCreateOpen(false)}}/>
      </div>
    </motion.div>
  );
};