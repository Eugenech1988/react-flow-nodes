import { type DragEvent, useCallback } from 'react';
import type { ReactFlowInstance } from '@xyflow/react';
import type { TPipelineNode, TPipelineEdge } from '@/entities';

interface UseDragAndDropParams {
  rfInstance: ReactFlowInstance<TPipelineNode, TPipelineEdge> | null;
  addNode: (node: TPipelineNode) => void;
  getNodeID: (type: string) => string;
}

export const useDragAndDrop = ({ rfInstance, addNode, getNodeID }: UseDragAndDropParams) => {
  const getInitNodeData = (nodeID: string, type: string) => ({
    id: nodeID,
    nodeType: type,
  });

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData || !rfInstance) return;

      const { nodeType } = JSON.parse(rawData);
      if (!nodeType) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeID = getNodeID(nodeType);
      const newNode: TPipelineNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      };

      addNode(newNode);
    },
    [rfInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return { onDrop, onDragOver };
};