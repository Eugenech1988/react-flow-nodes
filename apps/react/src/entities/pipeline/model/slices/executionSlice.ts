import type { StateCreator } from 'zustand';
import type {
  TPipelineStore,
  TExecutionState,
  TExecutionActions,
} from '@/entities/pipeline/model/types';
import { executeNode, type TNodeExecutionResult } from '@/features/execute-pipeline';
import { pipelineExecutionService } from '@/features/execute-pipeline/pipelineExecutionService';

export const createExecutionSlice: StateCreator<
  TPipelineStore,
  [],
  [],
  TExecutionState & TExecutionActions
> = (set, get) => ({
  id: null,
  executionStatus: 'idle',
  triggeredBy: 'MANUAL',
  startedAt: null,
  finishedAt: null,
  durationMs: null,
  nodesExecuted: 0,
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
          timestamp: Date.now(),
          type,
          message,
        },
      ],
    }));
  },

  runWorkflow: async () => {
    const { nodes, edges, addLog, pipelineId } = get();
    const startTime = Date.now();
    const startedAt = new Date().toISOString();

    if (nodes.length === 0) {
      addLog('Execution aborted: pipeline has no nodes', 'error');
      set({
        executionStatus: 'failed',
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        nodesExecuted: 0,
      });
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
      set({
        executionStatus: 'failed',
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        nodesExecuted: 0,
      });
      addLog(
        'Execution aborted: No valid start node (Input) found. Text nodes cannot trigger the workflow alone.',
        'error',
      );
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

    const topologicalOrder: string[] = [];
    while (validationQueue.length > 0) {
      const curr = validationQueue.shift()!;
      topologicalOrder.push(curr);
      const neighbors = validationMap.get(curr) || [];
      neighbors.forEach((next) => {
        inDegree.set(next, inDegree.get(next)! - 1);
        if (inDegree.get(next) === 0) {
          validationQueue.push(next);
        }
      });
    }

    if (topologicalOrder.length < nodes.length) {
      set({
        executionStatus: 'failed',
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        nodesExecuted: 0,
      });
      addLog('Execution aborted: Infinite loop detected in the workflow configuration.', 'error');
      return;
    }

    set({
      id: null,
      executionStatus: 'running',
      triggeredBy: 'MANUAL',
      startedAt,
      finishedAt: null,
      durationMs: null,
      nodesExecuted: 0,
      logs: [],
      activeNodeId: null,
      successNodeIds: [],
      failedNodeId: null,
    });
    addLog('Workflow execution started.', 'info');

    let backendExecutionId: string | null = null;
    if (pipelineId) {
      backendExecutionId = await pipelineExecutionService.startExecution({
        pipelineId,
        triggeredBy: get().triggeredBy,
        logs: get().logs,
      });
      if (backendExecutionId) {
        set({ id: backendExecutionId });
      }
    }

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const outgoingEdges = new Map<string, typeof edges>();
    const nodeInputs = new Map<string, TNodeExecutionResult>();
    nodes.forEach((n) => outgoingEdges.set(n.id, []));
    edges.forEach((e) => {
      if (nodeMap.has(e.source) && nodeMap.has(e.target)) {
        outgoingEdges.get(e.source)!.push(e);
      }
    });

    const executedNodeIds = new Set<string>();

    for (const currentNodeId of topologicalOrder) {
      if (get().executionStatus !== 'running') {
        break;
      }
      const node = nodeMap.get(currentNodeId);
      if (!node) continue;

      const isStartNode = startNodes.some((startNode) => startNode.id === node.id);
      const input = nodeInputs.get(node.id);
      if (!isStartNode && !input) continue;

      set({ activeNodeId: node.id });
      const currentTypeName = node.data?.nodeType || node.type || 'unknown';
      addLog(`Node "${node.id}" [${currentTypeName}] execution triggered`, 'info', node.id);

      try {
        const output = await executeNode(node, input, pipelineId);

        executedNodeIds.add(node.id);
        set((state) => ({
          successNodeIds: [...state.successNodeIds, node.id],
          nodesExecuted: executedNodeIds.size,
        }));
        addLog(`Node "${node.id}" successfully finished`, 'success', node.id);

        const isCondition = String(node.data?.nodeType || node.type || '')
          .toLowerCase()
          .includes('condition');
        const conditionHandle = output.matched ? 'true' : 'false';
        (outgoingEdges.get(currentNodeId) || []).forEach((edge) => {
          if (isCondition && edge.sourceHandle && edge.sourceHandle !== conditionHandle) return;
          nodeInputs.set(edge.target, { ...nodeInputs.get(edge.target), ...output });
        });
      } catch (error: any) {
        if (node.data?.continueOnError === 'true') {
          executedNodeIds.add(node.id);
          set({ nodesExecuted: executedNodeIds.size });
          addLog(
            `Node "${node.id}" failed, but the workflow will continue by node option.`,
            'error',
            node.id,
          );
          (outgoingEdges.get(currentNodeId) || []).forEach((edge) => {
            nodeInputs.set(edge.target, { ...nodeInputs.get(edge.target), ...input });
          });
          continue;
        }

        const endTime = Date.now();
        const durationMs = endTime - startTime;
        const finishedAt = new Date().toISOString();

        set({
          executionStatus: 'failed',
          failedNodeId: node.id,
          activeNodeId: null,
          finishedAt,
          durationMs,
        });
        addLog(`Execution stopped at node "${node.id}": ${error.message}`, 'error', node.id);

        if (backendExecutionId) {
          await pipelineExecutionService.finishExecution(backendExecutionId, {
            status: 'FAILED',
            finishedAt,
            durationMs,
            nodesExecuted: executedNodeIds.size,
            logs: get().logs,
          });
        }
        return;
      }
    }

    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const finishedAt = new Date().toISOString();

    if (get().executionStatus === 'running') {
      const hasUnreachableNodes = nodes.length > executedNodeIds.size;
      const isSuccess = !hasUnreachableNodes;

      if (hasUnreachableNodes) {
        set({
          executionStatus: 'failed',
          activeNodeId: null,
          finishedAt,
          durationMs,
        });
        addLog(
          'Workflow failed: some nodes were unreachable or skipped due to condition branches.',
          'error',
        );
      } else {
        set({
          executionStatus: 'success',
          activeNodeId: null,
          finishedAt,
          durationMs,
        });
        addLog('Workflow executed completely!', 'success');
      }

      if (backendExecutionId) {
        await pipelineExecutionService.finishExecution(backendExecutionId, {
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          finishedAt,
          durationMs,
          nodesExecuted: executedNodeIds.size,
          logs: get().logs,
        });
      }
    }
  },

  runNode: async (nodeId) => {
    const { nodes, addLog, pipelineId } = get();
    const node = nodes.find((item) => item.id === nodeId);
    const startTime = Date.now();
    const startedAt = new Date().toISOString();

    if (!node) {
      addLog('Node execution aborted: node was not found.', 'error', nodeId);
      return;
    }

    if (get().executionStatus === 'running') {
      addLog(
        'Wait for the current execution to finish before running another node.',
        'info',
        nodeId,
      );
      return;
    }

    set({
      id: null,
      executionStatus: 'running',
      triggeredBy: 'MANUAL',
      startedAt,
      finishedAt: null,
      durationMs: null,
      nodesExecuted: 0,
      activeNodeId: nodeId,
      successNodeIds: [],
      failedNodeId: null,
    });

    const nodeType = String(node.data?.nodeType || node.type || 'unknown');
    addLog(`Node "${node.id}" [${nodeType}] execution started.`, 'info', node.id);

    let backendExecutionId: string | null = null;
    if (pipelineId) {
      backendExecutionId = await pipelineExecutionService.startExecution({
        pipelineId,
        triggeredBy: get().triggeredBy,
        logs: get().logs,
      });
      if (backendExecutionId) {
        set({ id: backendExecutionId });
      }
    }

    try {
      const output = await executeNode(node, {}, pipelineId);
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const finishedAt = new Date().toISOString();

      set({
        executionStatus: 'success',
        activeNodeId: null,
        successNodeIds: [node.id],
        nodesExecuted: 1,
        finishedAt,
        durationMs,
      });
      addLog(
        `Node "${node.id}" successfully finished: ${JSON.stringify(output).slice(0, 120)}`,
        'success',
        node.id,
      );

      if (backendExecutionId) {
        await pipelineExecutionService.finishExecution(backendExecutionId, {
          status: 'SUCCESS',
          finishedAt,
          durationMs,
          nodesExecuted: 1,
          logs: get().logs,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown node execution error.';
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const finishedAt = new Date().toISOString();

      set({
        executionStatus: 'failed',
        activeNodeId: null,
        failedNodeId: node.id,
        nodesExecuted: 0,
        finishedAt,
        durationMs,
      });
      addLog(`Node "${node.id}" failed: ${message}`, 'error', node.id);

      if (backendExecutionId) {
        await pipelineExecutionService.finishExecution(backendExecutionId, {
          status: 'FAILED',
          finishedAt,
          durationMs,
          nodesExecuted: 0,
          logs: get().logs,
        });
      }
    }
  },

  stopWorkflow: () => {
    const { startedAt, id: backendExecutionId } = get();
    const startTime = startedAt ? new Date(startedAt).getTime() : Date.now();
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const finishedAt = new Date().toISOString();

    set({
      executionStatus: 'idle',
      activeNodeId: null,
      finishedAt,
      durationMs,
    });
    get().addLog('Workflow execution manually terminated by user.', 'info');

    if (backendExecutionId) {
      pipelineExecutionService.finishExecution(backendExecutionId, {
        status: 'CANCELED',
        finishedAt,
        durationMs,
        nodesExecuted: get().nodesExecuted,
        logs: get().logs,
      });
    }
  },

  clearLogs: () => set({ logs: [] }),
});