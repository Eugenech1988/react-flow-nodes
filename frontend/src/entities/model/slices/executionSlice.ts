import type { StateCreator } from 'zustand';
import type { PipelineStore, ExecutionState, ExecutionActions } from '../types';

export const createExecutionSlice: StateCreator<
  PipelineStore,
  [],
  [],
  ExecutionState & ExecutionActions
> = (set, get) => ({
  executionStatus: 'idle',
  activeNodeId: null,
  logs: [],

  addLog: (message, type = 'info', nodeId) => {
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: crypto.randomUUID(),
          nodeId,
          timestamp: new Date().toLocaleTimeString(),
          type,
          message,
        },
      ],
    }));
  },

  runWorkflow: async () => {
    const { nodes, addLog } = get();

    if (nodes.length === 0) {
      addLog('Execution aborted: pipeline has no nodes', 'error');
      set({ executionStatus: 'failed' });
      return;
    }

    set({ executionStatus: 'running', logs: [], activeNodeId: null });
    addLog('Workflow execution started.', 'info');

    for (const node of nodes) {
      if (get().executionStatus !== 'running') {
        break;
      }

      set({ activeNodeId: node.id });
      addLog(`Node "${node.id}" [${node.data.nodeType}] execution triggered`, 'info', node.id);

      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (node.data.status === 'error' || !node.data.error) {
              reject(new Error('Internal processing failure inside the node configuration'));
            } else {
              resolve(true);
            }
          }, 1200);
        });

        addLog(`Node "${node.id}" successfully finished`, 'success', node.id);
      } catch (error: any) {
        addLog(`Execution stopped at node "${node.id}": ${error.message}`, 'error', node.id);
        set({ executionStatus: 'failed', activeNodeId: null });
        return;
      }
    }

    if (get().executionStatus === 'running') {
      set({ executionStatus: 'success', activeNodeId: null });
      addLog('Workflow executed completely without any errors!', 'success');
    }
  },

  stopWorkflow: () => {
    set({ executionStatus: 'idle', activeNodeId: null });
    get().addLog('Workflow execution manually terminated by user.', 'info');
  },

  clearLogs: () => set({ logs: [] }),
});