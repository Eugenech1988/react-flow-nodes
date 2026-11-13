import dagre from '@dagrejs/dagre';
import type { Edge } from '@xyflow/react';
import type { TPipelineNode } from '@/entities';

export type TLayoutDirection = 'TB' | 'LR';

const DEFAULT_NODE_WIDTH = 172;
const DEFAULT_NODE_HEIGHT = 36;
const DEFAULT_NODE_SEP = 50;
const DEFAULT_RANK_SEP = 50;

export const computeAutoLayout = (
  nodes: TPipelineNode[],
  edges: Edge[],
  direction: TLayoutDirection = 'LR',
): TPipelineNode[] => {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: direction,
    nodesep: DEFAULT_NODE_SEP,
    ranksep: DEFAULT_RANK_SEP,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: node.measured?.width ?? DEFAULT_NODE_WIDTH,
      height: node.measured?.height ?? DEFAULT_NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node): TPipelineNode => {
    const pos = graph.node(node.id);
    const width = node.measured?.width ?? DEFAULT_NODE_WIDTH;
    const height = node.measured?.height ?? DEFAULT_NODE_HEIGHT;

    return {
      ...node,
      position: {
        x: pos.x - width / 2,
        y: pos.y - height / 2,
      },
    };
  });
};