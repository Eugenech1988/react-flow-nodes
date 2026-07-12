import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createGraphSlice } from './slices/graphSlice';
import { createExecutionSlice } from './slices/executionSlice';
import type { PipelineStore } from './types';

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
          past: state.past,
          future: state.future,
        }),
      }
    ),
    { name: 'PipelineStore' }
  )
);