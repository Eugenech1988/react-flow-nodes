import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addEdge, applyEdgeChanges, applyNodeChanges, MarkerType } from '@xyflow/react';
import type { PipelineState } from './types';
import type { PipelineNode, PipelineEdge } from './types';

export const useStore = create<PipelineState>()(
  persist(
    (set, get) => ({
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

      exportJSON: () => {
        try {
          const state = {
            nodes: get().nodes,
            edges: get().edges,
            nodeIDs: get().nodeIDs
          };
          const dataStr = JSON.stringify(state, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
          const filename = `pipeline-${new Date().toISOString().slice(0, 10)}.json`;

          const link = document.createElement('a');
          link.setAttribute('href', dataUri);
          link.setAttribute('download', filename);
          link.click();
        } catch (e) {
          console.error(e);
        }
      },

      importJSON: (file: File) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            if (typeof result !== 'string') return;

            const parsed = JSON.parse(result);
            if (parsed && (parsed.nodes || parsed.edges)) {
              get().takeSnapshot();
              set({
                nodes: parsed.nodes || [],
                edges: parsed.edges || [],
                nodeIDs: parsed.nodeIDs || {},
                future: []
              });
            }
          } catch (err) {
            console.error(err);
          }
        };
      }
    }),
    {
      name: 'pipeline_builder_state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        nodeIDs: state.nodeIDs,
      }),
    }
  )
);