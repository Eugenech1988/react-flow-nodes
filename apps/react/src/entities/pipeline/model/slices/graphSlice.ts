import type { StateCreator } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type {
  TPipelineStore,
  TGraphState,
  TGraphActions,
  TPipelineNode,
  TPipelineEdge,
} from '../types';

export const createGraphSlice: StateCreator<TPipelineStore, [], [], TGraphState & TGraphActions> = (
  set,
  get,
) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  clipboard: null,
  isDragging: false,
  past: [],
  future: [],
  isHistoryAction: false,
  lastRunAt: null,
  lastRunStatus: null,
  saveAction: null,
  saveStatus: 'saved',
  pipelineId: null,

  setLastRunInfo: (status, date = new Date()) =>
    set({
      lastRunAt: date,
      lastRunStatus: status,
    }),

  setSaveAction: (action) => set({ saveAction: action }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  triggerSave: async (withScreenshot = false, notify = false) => {
    const { saveAction } = get();
    if (saveAction) {
      await saveAction(withScreenshot, notify);
    } else {
      console.warn('Save action is not registered yet.');
    }
  },

  getNodeID: (type) => {
    const { nodes } = get();
    const prefix = `${type}-`;
    const indices = nodes
      .filter((n) => n.id.startsWith(prefix))
      .map((n) => parseInt(n.id.replace(prefix, ''), 10))
      .filter((num) => !isNaN(num));

    const maxIndex = indices.length > 0 ? Math.max(...indices) : 0;
    return `${type}-${maxIndex + 1}`;
  },

  takeSnapshot: () => {
    const { nodes, edges, past } = get();

    const currentStateStr = JSON.stringify({
      n: nodes.map((node) => ({
        id: node.id,
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      })),
      e: edges.map((edge) => ({ id: edge.id, s: edge.source, t: edge.target })),
    });

    if (past.length > 0) {
      const last = past[past.length - 1];
      const lastStateStr = JSON.stringify({
        n: last.nodes.map((node) => ({
          id: node.id,
          x: Math.round(node.position.x),
          y: Math.round(node.position.y),
        })),
        e: last.edges.map((edge) => ({ id: edge.id, s: edge.source, t: edge.target })),
      });

      if (currentStateStr === lastStateStr) {
        return;
      }
    }

    set({
      past: [...past, { nodes: structuredClone(nodes), edges: structuredClone(edges) }],
      future: [],
    });
  },

  addNode: (node) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: [...state.nodes, node],
      saveStatus: 'unsaved',
    }));
  },

  deleteNode: (nodeId) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      saveStatus: 'unsaved',
    }));
  },

  setNodes: (nodes) => {
    set({ nodes, saveStatus: 'unsaved' });
  },

  setEdges: (edges) => {
    set({ edges, saveStatus: 'unsaved' });
  },

  setPipelineId: (pipelineId) => set({ pipelineId }),

  setGraph: (nodes, edges) => {
    get().takeSnapshot();
    set({ nodes, edges, saveStatus: 'unsaved' });
  },

  initGraph: (nodes, edges, pipelineId = null) => {
    set({
      nodes,
      edges,
      pipelineId,
      past: [],
      future: [],
      saveStatus: 'saved',
    });
  },

  resetGraph: () => {
    set({
      nodes: [],
      edges: [],
      past: [],
      future: [],
      clipboard: null,
      saveStatus: 'saved',
    });
  },

  onNodesChange: (changes) => {
    const { nodes } = get();

    const hasActualRemoval = changes.some((c) => c.type === 'remove');
    if (hasActualRemoval) {
      get().takeSnapshot();
    }

    set({
      nodes: applyNodeChanges(changes, nodes) as TPipelineNode[],
      ...(changes.some((change) => change.type !== 'select' && change.type !== 'dimensions') && {
        saveStatus: 'unsaved' as const,
      }),
    });
  },

  onEdgesChange: (changes) => {
    // const { edges } = get();

    const hasActualRemoval = changes.some((c) => c.type === 'remove');
    if (hasActualRemoval) {
      get().takeSnapshot();
    }

    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
      ...(changes.some((change) => change.type !== 'select') && {
        saveStatus: 'unsaved' as const,
      }),
    }));
  },

  copyNodes: (selectedNodes: TPipelineNode[], allEdges: TPipelineEdge[]) => {
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    const edgesToCopy = allEdges.filter(
      (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
    );
    set({
      clipboard: {
        nodes: selectedNodes,
        edges: edgesToCopy,
      },
    });
  },

  pasteNodes: () => {
    const { clipboard, getNodeID, nodes } = get();
    if (!clipboard) return;

    get().takeSnapshot();

    let offset = 40;

    const hasOverlap = (checkOffset: number) => {
      return clipboard.nodes.some((clipNode) =>
        nodes.some(
          (canvasNode) =>
            Math.round(canvasNode.position.x) === Math.round(clipNode.position.x + checkOffset) &&
            Math.round(canvasNode.position.y) === Math.round(clipNode.position.y + checkOffset),
        ),
      );
    };

    while (hasOverlap(offset)) {
      offset += 40;
    }

    const idMap = new Map<string, string>();
    const newNodes = clipboard.nodes.map((node) => {
      const newId = getNodeID(node.type || 'default');
      idMap.set(node.id, newId);
      return {
        ...structuredClone(node),
        id: newId,
        position: {
          x: node.position.x + offset,
          y: node.position.y + offset,
        },
        data: { ...node.data, id: newId },
        selected: true,
      };
    });

    const newEdges = clipboard.edges.map((edge) => {
      const newSource = idMap.get(edge.source)!;
      const newTarget = idMap.get(edge.target)!;
      return {
        ...structuredClone(edge),
        id: `e-${newSource}-${newTarget}`,
        source: newSource,
        target: newTarget,
      };
    });

    const unselectedNodes = nodes.map((n) => ({ ...n, selected: false }));

    set({
      nodes: [...unselectedNodes, ...newNodes],
      edges: [...get().edges, ...newEdges],
      saveStatus: 'unsaved',
    });
  },

  onConnect: (connection) => {
    get().takeSnapshot();
    set((state) => ({
      edges: addEdge(connection, state.edges),
      saveStatus: 'unsaved',
    }));
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [fieldName]: fieldValue,
            },
          };
        }
        return node;
      }),
      saveStatus: 'unsaved',
    }));
  },

  exportJSON: () => {
    const { nodes, edges } = get();
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `pipeline-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  importJSON: (file) => {
    get().takeSnapshot();
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          set({
            nodes: parsed.nodes,
            edges: parsed.edges,
            saveStatus: 'unsaved',
          });
        }
      } catch (e) {
        console.error('Failed to parse import file', e);
      }
    };
    reader.readAsText(file);
  },

  clearCanvas: () => {
    get().takeSnapshot();
    set({ nodes: [], edges: [], saveStatus: 'unsaved' });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      future: [{ nodes: structuredClone(nodes), edges: structuredClone(edges) }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, { nodes: structuredClone(nodes), edges: structuredClone(edges) }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      saveStatus: 'unsaved',
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});
