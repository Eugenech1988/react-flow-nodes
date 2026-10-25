import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { usePipelineDialogStore } from '../model';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  isTotalEmpty: boolean;
}

export const EmptyState = ({ hasSearchQuery, isTotalEmpty }: EmptyStateProps) => {
  const openCreateModal = usePipelineDialogStore((state) => state.openCreateModal);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="border-border/80 bg-muted/5 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed p-12 text-center"
    >
      <div className="rounded-full border border-teal-500/20 bg-teal-500/10 p-4 text-teal-600 dark:text-teal-400">
        <Sparkles className="h-8 w-8" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-foreground text-base font-semibold">No pipelines found</h3>
        <p className="text-muted-foreground text-xs">
          {hasSearchQuery
            ? 'Try adjusting your search query or status filter.'
            : 'Get started by creating your first automation pipeline.'}
        </p>
      </div>
      {isTotalEmpty && (
        <AppButton
          variant="primary"
          size="sm"
          text="Create Pipeline"
          icon={Plus}
          onClick={openCreateModal}
        />
      )}
    </motion.div>
  );
};
