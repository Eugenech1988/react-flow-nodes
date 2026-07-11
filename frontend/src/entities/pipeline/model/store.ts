import { create } from 'zustand';
import { addEdge, applyEdgeChanges, applyNodeChanges, MarkerType } from '@xyflow/react';
import type { PipelineState } from './types';
import type { PipelineNode, PipelineEdge } from './types';

export const useStore = create<PipelineState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  past: [],
  future: [],

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    set({
      past: [...past, { nodes, edges }],
      future: [],
    });
  },

  addNode: (node) => {
    get().takeSnapshot();
    set({ nodes: [...get().nodes, node] });
  },

  deleteNode: (nodeId) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as PipelineNode[] });
  },

  onEdgesChange: (changes) => {
    const hasRemove = changes.some((c) => c.type === 'remove');
    if (hasRemove) {
      get().takeSnapshot();
    }
    set({ edges: applyEdgeChanges(changes, get().edges) as PipelineEdge[] });
  },

  onConnect: (connection) => {
    get().takeSnapshot();
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
        },
        get().edges
      ) as PipelineEdge[],
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [fieldName]: fieldValue } } : node
      ),
    });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: newFuture,
    });
  },
}));