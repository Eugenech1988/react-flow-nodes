import { motion } from 'framer-motion';
import { usePipelines } from '@/shared/hooks';
import { usePipelinesFilter } from './hooks';
import { PAGE_VARIANTS } from '@/shared/lib';
import { PipelineHeader, PipelineSearchAndFilter, PipelineGrid, PipelineModal } from './components';
import type { TPipeline } from '@/shared/lib';
import { usePipelineDialogStore } from '@/pages/pipelines/model';

export const PipelinesPage = () => {
  const { isOpen, mode, pipelineToEdit, closeModal } = usePipelineDialogStore();
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
        <PipelineHeader />
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
        <PipelineGrid pipelines={filteredPipelines} searchQuery={searchQuery}/>
        <PipelineModal
          isOpen={isOpen}
          mode={mode}
          initialData={pipelineToEdit}
          onClose={closeModal}
        />
      </div>
    </motion.div>
  );
};