import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createGraphSlice } from './slices/graphSlice';
import { createExecutionSlice } from './slices/executionSlice';
import type { TPipelineStore } from './types';
import {
  migratePersistedState,
  PERSISTED_STATE_VERSION,
  type TPersistedState,
} from './migrations';

export const useStore = create<TPipelineStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createGraphSlice(...args),
        ...createExecutionSlice(...args),
      }),
      {
        name: 'pipeline-storage',
        version: PERSISTED_STATE_VERSION,
        migrate: (persistedState, version) =>
          migratePersistedState(persistedState, version),
        partialize: (state): TPersistedState => ({
          nodes: state.nodes,
          edges: state.edges,
        }),
      },
    ),
    { name: 'PipelineStore' },
  ),
);
