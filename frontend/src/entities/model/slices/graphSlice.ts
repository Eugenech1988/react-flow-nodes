import type { StateCreator } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { PipelineStore, GraphState, GraphActions, PipelineNode } from '../types';

export const createGraphSlice: StateCreator<
  PipelineStore,
  [],
  [],
  GraphState & GraphActions
> = (set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  past: [],
  future: [],

  getNodeID: (type) => {
    const currentCount = get().nodeIDs[type] || 0;
    const newCount = currentCount + 1;

    set((state) => ({
      nodeIDs: { ...state.nodeIDs, [type]: newCount },
    }));

    return `${type}-${newCount}`;
  },

  takeSnapshot: () => {
    const { nodes, edges, past } = get();

    let newPast = [...past, { nodes, edges }];

    if (newPast.length > 15) {
      newPast = newPast.slice(-15);
    }

    set(
      () => ({
        past: newPast,
        future: [],
      }),
      false,
    );
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

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as PipelineNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
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

  undo: () => {
    const { past, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      nodes: previous.nodes,
      edges: previous.edges,
      future: [{ nodes, edges }, ...get().future],
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...get().past, { nodes, edges }],
      nodes: next.nodes,
      edges: next.edges,
      future: newFuture,
    });
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
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          get().takeSnapshot();
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
});