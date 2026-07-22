// src/pages/pipelines/components/EmptyState.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@pipeline/ui';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export const EmptyState = ({ hasSearchQuery }: EmptyStateProps) => {
  const navigate = useNavigate();

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
      {!hasSearchQuery && (
        <Button
          onClick={() => navigate('/pipelines/new')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Pipeline
        </Button>
      )}
    </motion.div>
  );
};