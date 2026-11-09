import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export function useAdminJobs() {
  const trpc = useTRPC();
  return useQuery(trpc.jobs.adminList.queryOptions());
}

export function useAdminJob(id: string | null) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.jobs.adminById.queryOptions({ id: id ?? '' }),
    enabled: !!id,
  });
}

export function useJobMutations() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries(trpc.jobs.adminList.queryFilter());
    queryClient.invalidateQueries(trpc.jobs.adminById.queryFilter());
  };

  const createJob = useMutation(trpc.jobs.create.mutationOptions());
  const updateJob = useMutation(trpc.jobs.update.mutationOptions());
  const upsertTranslation = useMutation(trpc.jobs.upsertTranslation.mutationOptions());
  const removeTranslation = useMutation(trpc.jobs.removeTranslation.mutationOptions());

  const publish = useMutation(trpc.jobs.publish.mutationOptions({ onSuccess: invalidate }));
  const archive = useMutation(trpc.jobs.archive.mutationOptions({ onSuccess: invalidate }));
  const remove = useMutation(trpc.jobs.remove.mutationOptions({ onSuccess: invalidate }));

  return {
    createJob,
    updateJob,
    upsertTranslation,
    removeTranslation,
    publish,
    archive,
    remove,
  };
}
