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

export const NODE_COLORS: Record<string, string> = {
  input: 'var(--node-input)',
  output: 'var(--node-output)',
  text: 'var(--node-text)',
  llm: 'var(--node-llm)',
  math: 'var(--node-math)',
  logic: 'var(--node-logic)',
  condition: 'var(--node-logic)',
  api: 'var(--node-api)',
  data: 'var(--node-data)',
  database: 'var(--node-database)',
  media: 'var(--node-media)',
};

export const NODE_TYPE_TO_CATEGORY: Record<string, string> = {
  customInput: 'input',
  llm: 'llm',
  customOutput: 'output',
  text: 'text',
  math: 'math',
  conditional: 'condition',
  api: 'api',
  database: 'database',
  image: 'media',
};