import { useState } from 'react';
import { Pencil, Trash2, Send, Archive, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pipeline/ui';
import { useJobMutations } from '../hooks/';
import { triggerPortalRevalidate } from '@/shared/api/revalidate';
import type { IJob } from '../model/types';
import { JobDeleteModal } from './JobDeleteModal'; // 👈 Импортируем модалку

interface JobsTableRowActionsProps {
  job: IJob;
  onEdit: (id: string) => void;
}

export const JobTableRowActions = ({ job, onEdit }: JobsTableRowActionsProps) => {
  const { publish, archive, remove } = useJobMutations();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isPublishing = publish.isPending && publish.variables?.id === job.id;
  const isArchiving = archive.isPending && archive.variables?.id === job.id;
  const isRemoving = remove.isPending && remove.variables?.id === job.id;
  const isAnyPending = isPublishing || isArchiving || isRemoving;

  const handleAction = (action: () => void) => {
    action();
    triggerPortalRevalidate();
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleAction(() => {
      remove.mutate(
        { id: job.id },
        {
          onSuccess: () => setIsDeleteModalOpen(false),
        },
      );
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isAnyPending}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => onEdit(job.id)}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none"
          >
            <Pencil className="text-muted-foreground h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {job.status !== 'PUBLISHED' && (
            <DropdownMenuItem
              onClick={(e) =>
                handleAction(() => {
                  e.stopPropagation();
                  publish.mutate({ id: job.id });
                })
              }
              disabled={isPublishing}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-emerald-600 outline-none focus:bg-emerald-500/10 focus:text-emerald-700 dark:text-emerald-400 dark:focus:bg-emerald-500/20 dark:focus:text-emerald-300"
            >
              <Send className="h-4 w-4" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </DropdownMenuItem>
          )}

          {job.status !== 'ARCHIVED' && (
            <DropdownMenuItem
              onClick={(e) =>
                handleAction(() => {
                  e.stopPropagation();
                  archive.mutate({ id: job.id });
                })
              }
              disabled={isArchiving}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-amber-600 outline-none focus:bg-amber-500/10 focus:text-amber-700 dark:text-amber-400 dark:focus:bg-amber-500/20 dark:focus:text-amber-300"
            >
              <Archive className="h-4 w-4" />
              {isArchiving ? 'Archiving...' : 'Archive'}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-border/60 my-1" />

          <DropdownMenuItem
            onClick={handleDeleteClick} // 👈 Изменено
            disabled={isRemoving}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-rose-600 outline-none focus:bg-rose-500/10 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/20 dark:focus:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            {isRemoving ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <JobDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isRemoving}
        jobSlug={job.slug}
      />
    </>
  );
};
