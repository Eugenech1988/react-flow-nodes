import { useAdminJob } from '../hooks';
import { GlobalLoader } from '@/shared/ui';
import { JobForm } from './JobForm';
import type { IJob } from '../model';

interface JobFormWrapperProps {
  jobId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function JobFormWrapper({ jobId, onSuccess, onCancel }: JobFormWrapperProps) {
  const { data: existingJob, isLoading } = useAdminJob(jobId);

  if (jobId && isLoading) {
    return <GlobalLoader />;
  }

  return (
    <JobForm
      jobId={jobId}
      initialData={existingJob as IJob | undefined}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}