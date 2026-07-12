import { type NodeTypes } from '@xyflow/react';
import {
  APINode,
  ConditionalNode,
  DatabaseNode,
  ImageNode,
  InputNode,
  LLMNode,
  MathNode,
  OutputNode,
  TextNode,
} from '@/features/manage-nodes';

export const GRID_SIZE = 20;
export const PRO_OPTIONS = { hideAttribution: true };
export const FIT_VIEW_OPTIONS = { padding: 0.2, maxZoom: 1.2 };

export const NODE_TYPES = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  conditional: ConditionalNode,
  api: APINode,
  database: DatabaseNode,
  image: ImageNode,
} as unknown as NodeTypes;