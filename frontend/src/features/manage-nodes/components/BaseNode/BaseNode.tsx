import { useState, useEffect, type CSSProperties } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useStore } from '@/entities';
import { extractVariables } from '@/features/manage-nodes/lib';
import { type BaseNodeProps, type NodeConfigFactory } from './BaseNode.types';
import {
  buildInitialValues,
  withAutoPositions,
  toVariableHandle,
} from './BaseNode.utils';
import { NodeHandles, NodeHeader, NodeField, VariableTags } from './BaseNode.parts';

export const BaseNode = ({
                           id,
                           data,
                           title,
                           category = 'default',
                           icon,
                           fields = [],
                           handles = [],
                           children,
                           minWidth = 220,
                           withVariables = false,
                           selected,
                         }: BaseNodeProps) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const activeNodeId = useStore((state) => state.activeNodeId);
  const successNodeIds = useStore((state) => state.successNodeIds);
  const failedNodeId = useStore((state) => state.failedNodeId);

  const [values, setValues] = useState(() => buildInitialValues(fields, data, id));
  const { deleteElements } = useReactFlow();

  useEffect(() => {
    const currentType = title?.toLowerCase() || category || 'default';
    if (data?.nodeType !== currentType) {
      updateNodeField(id, 'nodeType', currentType);
    }
  }, [id, data?.nodeType, title, category, updateNodeField]);

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    updateNodeField(id, key, value);
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const variables = withVariables ? extractVariables(Object.values(values).join(' ')) : [];
  const variableHandles = withVariables ? variables.map(toVariableHandle) : [];

  const positionedHandles = withAutoPositions([...handles, ...variableHandles]);
  const targetHandles = positionedHandles.filter((handle) => handle.type === 'target');
  const sourceHandles = positionedHandles.filter((handle) => handle.type === 'source');

  const nodeStyle: CSSProperties = { minWidth };
  const hasBody = fields.length > 0 || Boolean(children);

  const isActive = activeNodeId === id;
  const isSuccess = successNodeIds.includes(id);
  const isFailed = failedNodeId === id;

  return (
    <div
      style={nodeStyle}
      data-category={category}
      className={`
        base-node relative rounded-2xl border bg-card text-card-foreground shadow-md transition-all duration-200 overflow-visible text-left
        ${isActive ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg z-10 scale-[1.01]' : ''}
        ${isSuccess ? 'border-emerald-500 dark:border-emerald-600 shadow-xs' : ''}
        ${isFailed ? 'border-rose-500 dark:border-rose-600 shadow-md z-10' : ''}
        ${!isActive && !isSuccess && !isFailed && !selected ? 'border-border' : ''}
        ${selected ? 'border-primary ring-2 ring-primary/20 z-20 shadow-lg' : ''}
      `}
    >
      <div className="absolute -top-2.5 -right-2.5 z-30 pointer-events-none flex items-center justify-center">
        {isActive && (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-card shadow-xs">
            <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {isSuccess && (
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-card shadow-xs text-white font-bold text-[10px]">
            ✓
          </div>
        )}
        {isFailed && (
          <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center border-2 border-card shadow-xs text-white font-bold text-[10px]">
            ✕
          </div>
        )}
      </div>

      <NodeHandles handles={targetHandles} type="target" />

      <NodeHeader title={title} icon={icon} onDelete={handleDelete} />

      {hasBody && (
        <div className="flex flex-col gap-3 p-4 text-card-foreground">
          {fields.map((field) => (
            <NodeField
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          ))}
          {withVariables && <VariableTags variables={variables} />}
          {children && children({ values, handleFieldChange, id })}
        </div>
      )}

      <NodeHandles handles={sourceHandles} type="source" />
    </div>
  );
};

export const createNode = (config: NodeConfigFactory) => {
  if (typeof config === 'function') return (props: any) => config(props);
  return (props: any) => <BaseNode id={props.id} data={props.data} selected={props.selected} {...props} {...config} />;
};