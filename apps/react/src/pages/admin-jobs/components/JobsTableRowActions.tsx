import { Pencil, Trash2, Send, Archive } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useJobMutations } from '../hooks/';
import type { IJob } from '../model/types';

interface JobsTableRowActionsProps {
  job: IJob;
  onEdit: (id: string) => void;
}

export const JobsTableRowActions = ({ job, onEdit }: JobsTableRowActionsProps) => {
  const { publish, archive, remove } = useJobMutations();

  const isPublishing = publish.isPending && publish.variables?.id === job.id;
  const isArchiving = archive.isPending && archive.variables?.id === job.id;
  const isRemoving = remove.isPending && remove.variables?.id === job.id;

  const handleDelete = () => {
    if (confirm(`Delete "${job.slug}"? This cannot be undone.`)) {
      remove.mutate({ id: job.id });
    }
  };

  return (
    <div className="flex gap-1">
      <span title="Edit">
        <AppButton variant="ghost" size="sm" icon={Pencil} onClick={() => onEdit(job.id)} />
      </span>

      {job.status !== 'PUBLISHED' && (
        <span title="Publish">
          <AppButton
            variant="ghost"
            size="sm"
            icon={Send}
            iconClassName="text-emerald-500"
            onClick={() => publish.mutate({ id: job.id })}
            isPending={isPublishing}
          />
        </span>
      )}

      {job.status !== 'ARCHIVED' && (
        <span title="Archive">
          <AppButton
            variant="ghost"
            size="sm"
            icon={Archive}
            iconClassName="text-amber-500"
            onClick={() => archive.mutate({ id: job.id })}
            isPending={isArchiving}
          />
        </span>
      )}

      <span title="Delete">
        <AppButton
          variant="ghost"
          size="sm"
          icon={Trash2}
          iconClassName="text-destructive"
          onClick={handleDelete}
          isPending={isRemoving}
        />
      </span>
    </div>
  );
};
