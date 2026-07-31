import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { usePipelineDialogStore } from '@/pages/pipelines/model';

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
      className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/5 space-y-4"
    >
      <div className="p-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">No pipelines found</h3>
        <p className="text-xs text-muted-foreground">
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