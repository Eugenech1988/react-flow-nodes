import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Archive,
  ImageOff,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pipeline/ui';
import { formatDate } from '@/shared/lib';
import { usePipelineHandler } from '@/features/manage-pipelines';
import type { TPipeline } from '@/entities';
import { usePipelineDialogStore } from '../model';

const BASE_URL = import.meta.env.VITE_API_URL;

interface TPipelineCardProps {
  pipeline: TPipeline;
}

export const PipelineCard = ({ pipeline }: TPipelineCardProps) => {
  const openUpdateModal = usePipelineDialogStore((state) => state.openUpdateModal);
  const navigate = useNavigate();

  const { deletePipeline, setCurrentPipeline } = usePipelineHandler({
    onSetCurrentSuccess: () => navigate('/'),
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePipeline.mutate(pipeline.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openUpdateModal(pipeline);
  };

  const handleCardClick = () => {
    setCurrentPipeline.mutate(pipeline);
  };

  const imageSrc = pipeline.screenshotUrl ? `${BASE_URL}${pipeline.screenshotUrl}` : null;
  const status = pipeline.status?.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: deletePipeline.isPending ? 0.5 : 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group border-border/80 bg-card pointer-events-auto relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border shadow-xs transition-all hover:border-teal-500/40 hover:shadow-md"
      onClick={handleCardClick}
    >
      {deletePipeline.isPending && (
        <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      )}

      <div className="space-y-3 p-5">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <span
              onClick={handleEdit}
              className="text-foreground line-clamp-1 text-base font-semibold transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400"
            >
              {pipeline.name}
            </span>

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0 cursor-pointer rounded-lg p-1 transition-colors outline-none">
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border/80 bg-card w-40 rounded-xl border p-1 shadow-lg"
                >
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors"
                  >
                    <Edit3 className="text-muted-foreground h-3.5 w-3.5" />
                    <span>Edit Workflow</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deletePipeline.isPending}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-500/10 focus:bg-rose-500/10 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-current" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {pipeline.description || 'No description provided.'}
          </p>
        </div>

        <div className="bg-muted/40 border-border/40 relative aspect-video w-full overflow-hidden rounded-xl border">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt={pipeline.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </>
          ) : (
            <div className="text-muted-foreground/60 bg-muted/20 flex h-full w-full flex-col items-center justify-center gap-2 select-none">
              <ImageOff className="h-12 w-12 stroke-[1.5]" />
              <span className="text-base font-medium tracking-wide">No screenshot</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-border/50 bg-muted/20 flex items-center justify-between border-t px-5 py-3.5 text-xs">
        <div className="flex items-center gap-1.5">
          {status === 'ACTIVE' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-600 dark:text-teal-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              Active
            </span>
          )}
          {status === 'PAUSED' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <PauseCircle className="h-3 w-3" />
              Paused
            </span>
          )}
          {status === 'ARCHIVED' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <Archive className="h-3 w-3" />
              Archived
            </span>
          )}
          {(status === 'DRAFT' || !status) && (
            <span className="bg-muted text-muted-foreground border-border/50 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium">
              Draft
            </span>
          )}
        </div>

        <div className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(pipeline.lastRunAt) || 'Never run'}</span>
          {pipeline.lastRunStatus === 'SUCCESS' && (
            <CheckCircle2 className="ml-0.5 h-3.5 w-3.5 text-teal-500" />
          )}
          {pipeline.lastRunStatus === 'FAILED' && (
            <AlertCircle className="ml-0.5 h-3.5 w-3.5 text-rose-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
