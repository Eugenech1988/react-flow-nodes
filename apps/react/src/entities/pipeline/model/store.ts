import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createGraphSlice } from '@/entities/pipeline/model/slices/graphSlice';
import { createExecutionSlice } from '@/entities/pipeline/model/slices/executionSlice';
import type { PipelineStore } from '@/entities/pipeline/model/types';

export const useStore = create<PipelineStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createGraphSlice(...args),
        ...createExecutionSlice(...args),
      }),
      {
        name: 'pipeline-storage',
        partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
          nodeIDs: state.nodeIDs,
        }),
      }
    ),
    { name: 'PipelineStore' }
  )
);