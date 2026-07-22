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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pipeline/ui';
import type { IPipeline } from '../types';

interface PipelineCardProps {
  pipeline: IPipeline;
  onDelete: (id: string) => void;
}

export const PipelineCard = ({ pipeline, onDelete }: PipelineCardProps) => {
  const navigate = useNavigate();

  const handleDelete = () => onDelete(pipeline.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group border border-border/80 bg-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between"
    >
      <div className="space-y-3 p-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border/40">
          <img
            src={pipeline.thumbnail}
            alt={pipeline.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <span
              onClick={() => navigate(`/pipelines/${pipeline.id}`)}
              className="font-semibold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 cursor-pointer transition-colors line-clamp-1"
            >
              {pipeline.name}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors outline-none cursor-pointer shrink-0">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 border border-border/80 bg-card p-1 rounded-xl shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Edit Workflow</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-current" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {pipeline.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {pipeline.status === 'active' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Active
            </span>
          )}
          {pipeline.status === 'paused' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <PauseCircle className="w-3 h-3" />
              Paused
            </span>
          )}
          {pipeline.status === 'draft' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{pipeline.lastRunAt || 'Never run'}</span>
          {pipeline.lastRunStatus === 'success' && (
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 ml-0.5" />
          )}
          {pipeline.lastRunStatus === 'failed' && (
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
          )}
        </div>
      </div>
    </motion.div>
  );
};