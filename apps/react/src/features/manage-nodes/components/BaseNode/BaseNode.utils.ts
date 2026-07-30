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

export const buildInitialValues = (fields: TFieldConfig[], data: TNodeData, id: string): TNodeFieldValues => {
  const initialValues: TNodeFieldValues = {};
  fields.forEach((field) => {
    const fallbackValue = typeof field.defaultValue === 'function' ? field.defaultValue(id) : field.defaultValue;
    initialValues[field.key] = data[field.key] ?? fallbackValue ?? '';
  });
  return initialValues;
};

export const toVariableHandle = (variable: string): THandleConfig => ({
  id: `var-${variable}`,
  type: 'target',
  position: Position.Left,
});

export const inputFieldClassName =
  'bg-background/50 border-slate-200 dark:border-zinc-800 transition-colors hover:border-slate-300 dark:hover:border-zinc-700';