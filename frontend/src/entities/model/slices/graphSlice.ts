import type { StateCreator } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { PipelineStore, GraphState, GraphActions, PipelineNode, PipelineEdge } from '../types';

export const createGraphSlice: StateCreator<
  PipelineStore,
  [],
  [],
  GraphState & GraphActions & { past: any[]; future: any[]; isHistoryAction: boolean }
> = (set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  clipboard: null,
  isDragging: false,
  past: [],
  future: [],
  isHistoryAction: false,

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
    const { nodes, edges, past, isHistoryAction } = get();
    if (isHistoryAction) return;

    set({
      past: [...past, { nodes: structuredClone(nodes), edges: structuredClone(edges) }],
      future: [],
    });
  },

  addNode: (node) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (nodeId) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setGraph: (nodes, edges) => {
    get().takeSnapshot();
    set({ nodes, edges });
  },

  onNodesChange: (changes) => {
    const { nodes, isDragging, isHistoryAction } = get();

    if (isHistoryAction) {
      set({
        nodes: applyNodeChanges(changes, nodes) as PipelineNode[],
      });
      return;
    }

    const isDragStart = changes.some((c) => c.type === 'position' && 'dragging' in c && c.dragging === true);
    const isDragStop = changes.some((c) => c.type === 'position' && 'dragging' in c && c.dragging === false);

    const isUserAction = changes.some(
      (c) => c.type === 'remove' || (c.type === 'position' && 'position' in c)
    );

    if (isDragStart && !isDragging) {
      get().takeSnapshot();
      set({ isDragging: true });
    }

    if (!isDragging && !isDragStart && isUserAction) {
      get().takeSnapshot();
    }

    set({
      nodes: applyNodeChanges(changes, nodes) as PipelineNode[],
      isDragging: isDragStop ? false : isDragging,
    });
  },

  onEdgesChange: (changes) => {
    const { edges, isHistoryAction } = get();

    if (isHistoryAction) {
      set({
        edges: applyEdgeChanges(changes, edges),
      });
      return;
    }

    const isUserAction = changes.some((c) => c.type === 'remove');
    if (isUserAction) {
      get().takeSnapshot();
    }

    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  copyNodes: (selectedNodes: PipelineNode[], allEdges: PipelineEdge[]) => {
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    const edgesToCopy = allEdges.filter(
      (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    );
    set({
      clipboard: {
        nodes: selectedNodes,
        edges: edgesToCopy,
      },
    });
  },

  pasteNodes: () => {
    get().takeSnapshot();
    const { clipboard, getNodeID } = get();
    if (!clipboard) return;
    const idMap = new Map<string, string>();
    const newNodes = clipboard.nodes.map((node) => {
      const newId = getNodeID(node.type || 'default');
      idMap.set(node.id, newId);
      return {
        ...structuredClone(node),
        id: newId,
        position: {
          x: node.position.x + 40,
          y: node.position.y + 40,
        },
        data: { ...node.data, id: newId },
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
    set((state) => ({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
    }));
  },

  onConnect: (connection) => {
    get().takeSnapshot();
    set((state) => ({
      edges: addEdge(connection, state.edges),
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
    set({ nodes: [], edges: [] });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      isHistoryAction: true,
      past: newPast,
      future: [{ nodes: structuredClone(nodes), edges: structuredClone(edges) }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
    });

    setTimeout(() => set({ isHistoryAction: false }), 0);
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      isHistoryAction: true,
      past: [...past, { nodes: structuredClone(nodes), edges: structuredClone(edges) }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
    });

    setTimeout(() => set({ isHistoryAction: false }), 0);
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});