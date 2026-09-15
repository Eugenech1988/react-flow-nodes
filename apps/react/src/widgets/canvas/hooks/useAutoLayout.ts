import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import type { Edge } from '@xyflow/react';
import type { TPipelineNode } from '@/entities';

export const useAutoLayout = (
  nodes: TPipelineNode[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'LR'
) => {
  return useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 50 });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.measured?.width ?? 172,
        height: node.measured?.height ?? 36
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node): TPipelineNode => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.measured?.width ?? 172) / 2,
          y: nodeWithPosition.y - (node.measured?.height ?? 36) / 2
        },
      };
    });
  }, [nodes, edges, direction]);
};