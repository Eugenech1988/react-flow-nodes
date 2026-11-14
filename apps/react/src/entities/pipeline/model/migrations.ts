import type { TPipelineEdge, TPipelineNode } from './types';

export const PERSISTED_STATE_VERSION = 2;

export type TPersistedState = {
  nodes: TPipelineNode[];
  edges: TPipelineEdge[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const ensurePersistedShape = (state: unknown): TPersistedState => {
  if (!isObject(state)) {
    return { nodes: [], edges: [] };
  }
  return {
    nodes: Array.isArray(state.nodes) ? (state.nodes as TPipelineNode[]) : [],
    edges: Array.isArray(state.edges) ? (state.edges as TPipelineEdge[]) : [],
  };
};

const migrateV0ToV1 = (state: unknown): TPersistedState => {
  return ensurePersistedShape(state);
};

const normalizeContinueOnError = (node: TPipelineNode): TPipelineNode => {
  const raw: unknown = node.data?.continueOnError;
  if (raw === undefined || raw === null) return node;
  if (typeof raw === 'boolean') return node;

  let nextValue: boolean | undefined;
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'true') nextValue = true;
    else if (lower === 'false') nextValue = false;
  } else if (typeof raw === 'number') {
    nextValue = raw !== 0;
  }

  if (nextValue === undefined) {
    const { continueOnError, ...restData } = node.data;
    return { ...node, data: restData };
  }

  return { ...node, data: { ...node.data, continueOnError: nextValue } };
};

const migrateV1ToV2 = (state: TPersistedState): TPersistedState => {
  return {
    ...state,
    nodes: state.nodes.map(normalizeContinueOnError),
  };
};

export const migratePersistedState = (state: unknown, fromVersion: number): TPersistedState => {
  let current = ensurePersistedShape(state);

  if (fromVersion < 1) {
    current = migrateV0ToV1(current);
  }
  if (fromVersion < 2) {
    current = migrateV1ToV2(current);
  }

  return ensurePersistedShape(current);
};
