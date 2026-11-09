import { useParams, useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Briefcase } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useAdminJobs } from './hooks';
import { JobTable, JobForm } from './components';

export function AdminJobsPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const isCreating = id === 'new';
  const isEditing = !!id && !isCreating;

  if (isCreating || isEditing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <JobForm
          jobId={isEditing ? id! : null}
          onSuccess={() => navigate('/admin/jobs')}
          onCancel={() => navigate('/admin/jobs')}
        />
      </div>
    );
  }

  return <JobsList onEdit={(jobId) => navigate(`/admin/jobs/${jobId}`)} />;
}

function JobsList({ onEdit }: { onEdit: (id: string) => void }) {
  const { data: jobs, isLoading, isError, error } = useAdminJobs();

  if (isError) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4">
        <div className="border-destructive/40 bg-destructive/5 rounded-xl border p-8 text-center">
          <AlertCircle className="text-destructive mx-auto mb-3 h-8 w-8" />
          <h3 className="text-destructive mb-1 font-bold">Failed to load jobs</h3>
          <p className="text-destructive/80 text-sm">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Job Vacancies
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage open positions on the marketing site
          </p>
        </div>
        <AppButton
          isLink
          linkTo="/admin/jobs/new"
          icon={Plus}
          variant="primary"
          text="New Vacancy"
        />
      </div>

      <JobTable jobs={jobs ?? []} onEdit={onEdit} isLoading={isLoading} />
    </div>
  );
}