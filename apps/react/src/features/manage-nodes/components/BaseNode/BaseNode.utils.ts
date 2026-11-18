import { Position } from '@xyflow/react';
import type { TFieldConfig, THandleConfig, TNodeData, TNodeFieldValues } from '@/entities';
import type { Side } from './BaseNode.types';

export const sideOf = (handle: THandleConfig): Side => {
  const position = handle.position || (handle.type === 'target' ? Position.Left : Position.Right);
  return position === Position.Left ? 'left' : 'right';
};

export const withEvenSpacing = (sideHandles: THandleConfig[]): THandleConfig[] =>
  sideHandles.map((handle, index) => ({
    ...handle,
    style: handle.style || { top: `${((index + 1) / (sideHandles.length + 1)) * 100}%` },
  }));

export const withAutoPositions = (handles: THandleConfig[]): THandleConfig[] => {
  const bySide: Record<Side, THandleConfig[]> = { left: [], right: [] };
  handles.forEach((handle) => bySide[sideOf(handle)].push(handle));
  return [...withEvenSpacing(bySide.left), ...withEvenSpacing(bySide.right)];
};

export const buildInitialValues = (
  fields: TFieldConfig[],
  data: TNodeData,
  id: string,
): TNodeFieldValues => {
  const dataRecord: Record<string, unknown> = data;

  return fields.reduce<TNodeFieldValues>((acc, field) => {
    const fallbackValue =
      typeof field.defaultValue === 'function' ? field.defaultValue(id) : field.defaultValue;
    const rawValue = dataRecord[field.key];

    acc[field.key] = (rawValue ?? fallbackValue ?? '') as TNodeFieldValues[string];
    return acc;
  }, {});
};

export const toVariableHandle = (variable: string): THandleConfig => ({
  id: `var-${variable}`,
  type: 'target',
  position: Position.Left,
});

export const inputFieldClassName =
  'bg-muted/25 border-border/80 rounded-md text-xs transition-colors hover:border-[var(--node-accent)]/60 focus-visible:ring-1 focus-visible:ring-[var(--node-accent)]';