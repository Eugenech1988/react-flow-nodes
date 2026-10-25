import { motion } from 'framer-motion';
import { usePipelines } from '@/entities';
import { usePipelinesFilter } from './hooks';
import { PAGE_VARIANTS } from '@/shared/lib';
import { PipelineHeader, PipelineSearchAndFilter, PipelineGrid, PipelineModal } from './components';
import { usePipelineDialogStore } from './model';

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
  } = usePipelinesFilter(pipelines);

  return (
    <motion.div
      className="bg-background text-foreground p-4 transition-colors duration-300 md:p-6"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="mx-auto max-w-7xl space-y-8">
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
        <PipelineGrid
          totalPipelinesCount={pipelines.length}
          pipelines={filteredPipelines}
          searchQuery={searchQuery}
        />
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
