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
  successNodeIds: [],
  failedNodeId: null,

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
    const { nodes, edges, addLog } = get();

    if (nodes.length === 0) {
      addLog('Execution aborted: pipeline has no nodes', 'error');
      set({ executionStatus: 'failed' });
      return;
    }

    const startNodes = nodes.filter((node) => {
      
      const dataNodeType = String(node.data?.nodeType || '').toLowerCase();
      const reactFlowType = String(node.type || '').toLowerCase();

      
      
      const isInput = dataNodeType.includes('input') || reactFlowType.includes('input');
      const isText = dataNodeType.includes('text') || reactFlowType.includes('text');

      const isStartType = isInput && !isText;
      const hasIncoming = edges.some((edge) => edge.target === node.id);

      return isStartType && !hasIncoming;
    });

    if (startNodes.length === 0) {
      set({ executionStatus: 'failed' });
      addLog('Execution aborted: No valid start node (Input) found. Text nodes cannot trigger the workflow alone.', 'error');
      return;
    }

    const inDegree = new Map<string, number>();
    const validationMap = new Map<string, string[]>();

    nodes.forEach((n) => {
      inDegree.set(n.id, 0);
      validationMap.set(n.id, []);
    });

    edges.forEach((e) => {
      if (validationMap.has(e.source) && validationMap.has(e.target)) {
        validationMap.get(e.source)!.push(e.target);
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
      }
    });

    const validationQueue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) validationQueue.push(id);
    });

    let visitedCount = 0;
    while (validationQueue.length > 0) {
      const curr = validationQueue.shift()!;
      visitedCount++;
      const neighbors = validationMap.get(curr) || [];
      neighbors.forEach((next) => {
        inDegree.set(next, inDegree.get(next)! - 1);
        if (inDegree.get(next) === 0) {
          validationQueue.push(next);
        }
      });
    }

    if (visitedCount < nodes.length) {
      set({ executionStatus: 'failed' });
      addLog('Execution aborted: Infinite loop detected in the workflow configuration.', 'error');
      return;
    }

    set({
      executionStatus: 'running',
      logs: [],
      activeNodeId: null,
      successNodeIds: [],
      failedNodeId: null,
    });
    addLog('Workflow execution started.', 'info');

    const queue: string[] = startNodes.map((n) => n.id);
    const visited = new Set<string>();
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const adjacencyMap = new Map<string, string[]>();
    nodes.forEach((n) => adjacencyMap.set(n.id, []));
    edges.forEach((e) => {
      if (adjacencyMap.has(e.source) && nodeMap.has(e.target)) {
        adjacencyMap.get(e.source)!.push(e.target);
      }
    });

    while (queue.length > 0) {
      if (get().executionStatus !== 'running') {
        break;
      }

      const currentNodeId = queue.shift()!;
      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      const node = nodeMap.get(currentNodeId);
      if (!node) continue;

      set({ activeNodeId: node.id });
      const currentTypeName = node.data?.nodeType || node.type || 'unknown';
      addLog(`Node "${node.id}" [${currentTypeName}] execution triggered`, 'info', node.id);

      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const filterEffect = node.data?.filterEffect || node.data?.status;
            if (filterEffect === 'error' || node.data?.status === 'error') {
              reject(new Error('Internal processing failure inside the node configuration'));
            } else {
              resolve(true);
            }
          }, 1200);
        });

        set((state) => ({
          successNodeIds: [...state.successNodeIds, node.id],
        }));
        addLog(`Node "${node.id}" successfully finished`, 'success', node.id);

        const nextTargetIds = adjacencyMap.get(currentNodeId) || [];
        nextTargetIds.forEach((targetId) => {
          if (!visited.has(targetId)) {
            queue.push(targetId);
          }
        });

      } catch (error: any) {
        set({
          executionStatus: 'failed',
          failedNodeId: node.id,
          activeNodeId: null,
        });
        addLog(`Execution stopped at node "${node.id}": ${error.message}`, 'error', node.id);
        return;
      }
    }

    if (get().executionStatus === 'running') {
      set({ executionStatus: 'success', activeNodeId: null });
      addLog('Workflow executed completely!', 'success');
    }
  },

  stopWorkflow: () => {
    set({
      executionStatus: 'idle',
      activeNodeId: null,
      successNodeIds: [],
      failedNodeId: null,
    });
    get().addLog('Workflow execution manually terminated by user.', 'info');
  },

  clearLogs: () => set({ logs: [] }),
});