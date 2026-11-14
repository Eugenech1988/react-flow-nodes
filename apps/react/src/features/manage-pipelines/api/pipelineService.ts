import { api, trpcClient } from '@/shared/api';
import type {
  TCreatePipelineInputData,
  TUpdatePipelineInputData,
} from '@pipeline/contracts';
import type { TPipeline } from '@/entities';

const REST_ENDPOINT = '/pipelines';

interface ICreatePipelinePayload {
  data: TCreatePipelineInputData;
  file?: File;
}

interface ISetCurrentPipelinePayload {
  id: string;
  name: string;
  description: string | null;
  status: TPipeline['status'];
  lastRunAt: string | null;
  lastRunStatus: 'SUCCESS' | 'FAILED' | 'RUNNING' | null;
  screenshotUrl: string | null;
}

export const pipelineService = {
  create: async ({ data, file }: ICreatePipelinePayload) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (file) formData.append('file', file);
    return api.post(REST_ENDPOINT, formData);
  },

  update: async (data: TUpdatePipelineInputData) => {
    if (!data.id) {
      throw new Error('Pipeline ID is required for update');
    }
    return trpcClient.pipelines.update.mutate(data);
  },

  remove: (pipelineId: string) =>
    trpcClient.pipelines.remove.mutate({ id: pipelineId }),

  setCurrent: (payload: ISetCurrentPipelinePayload) =>
    trpcClient.users.setCurrentPipeline.mutate(payload),
};
