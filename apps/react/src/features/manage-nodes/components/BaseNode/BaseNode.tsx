import { useState, useEffect, type CSSProperties } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Play } from 'lucide-react';
import { useStore } from '@/entities';
import { extractVariables } from '@/shared/lib';
import { type IBaseNodeProps, type NodeConfigFactory } from './BaseNode.types';
import { buildInitialValues, withAutoPositions, toVariableHandle } from './BaseNode.utils';
import { NodeHandles, NodeHeader, NodeField, NodeMeta, VariableTags } from './BaseNode.parts';

export const BaseNode = ({
  id,
  data,
  title,
  subtitle,
  category = 'default',
  icon,
  fields = [],
  handles = [],
  children,
  minWidth = 112,
  withVariables = false,
  selected,
}: IBaseNodeProps) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const activeNodeId = useStore((state) => state.activeNodeId);
  const successNodeIds = useStore((state) => state.successNodeIds);
  const failedNodeId = useStore((state) => state.failedNodeId);
  const executionStatus = useStore((state) => state.executionStatus);
  const runNode = useStore((state) => state.runNode);

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

  const hasBody = fields.length > 0 || Boolean(children);
  const nodeStyle: CSSProperties = {
    minWidth: selected && hasBody ? Math.max(minWidth, 220) : minWidth,
  };

  const isActive = activeNodeId === id;
  const isSuccess = successNodeIds.includes(id);
  const isFailed = failedNodeId === id;
  const continueOnError = data?.continueOnError === 'true';

  return (
    <div
      style={nodeStyle}
      data-category={category}
      className={`base-node relative overflow-visible text-left ${isActive ? 'z-10' : ''} ${selected ? 'z-20' : ''}`}
    >
      <div className="pointer-events-none absolute -top-2.5 -right-2.5 z-30 flex items-center justify-center">
        {isActive && (
          <div className="border-card flex h-5 w-5 items-center justify-center rounded-full border-2 bg-blue-500 shadow-xs">
            <div className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
        {isSuccess && (
          <div className="border-card flex h-5 w-5 items-center justify-center rounded-full border-2 bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
            ✓
          </div>
        )}
        {isFailed && (
          <div className="border-card flex h-5 w-5 items-center justify-center rounded-full border-2 bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            ✕
          </div>
        )}
      </div>

      <div className="node-card">
        <NodeHandles handles={targetHandles} type="target" />
        <NodeHeader icon={icon} onDelete={handleDelete} />
        {hasBody && (
          <div
            className={`node-details border-border/70 text-card-foreground flex flex-col gap-3 border-t px-3.5 py-3 ${
              selected ? '' : 'node-details--collapsed'
            }`}
          >
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
            <div className="node-options border-border/70 flex flex-col gap-2 border-t pt-3">
              <span className="text-muted-foreground text-[11px] font-medium">Options</span>
              <label className="nodrag nopan text-card-foreground flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={continueOnError}
                  onChange={(event) =>
                    updateNodeField(id, 'continueOnError', String(event.target.checked))
                  }
                  className="accent-[var(--node-accent)]"
                />
                Continue on error
              </label>
              <button
                type="button"
                onClick={() => runNode(id)}
                disabled={executionStatus === 'running'}
                className="nodrag nopan flex h-8 items-center justify-center gap-1.5 rounded-md bg-(--node-accent) px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                Run node
              </button>
            </div>
          </div>
        )}
        <NodeHandles handles={sourceHandles} type="source" />
      </div>
      <NodeMeta
        title={title}
        subtitle={
          subtitle ??
          (category === 'input'
            ? 'Trigger'
            : category === 'output'
              ? 'Workflow output'
              : 'Workflow node')
        }
      />
    </div>
  );
};

export const createNode = (config: NodeConfigFactory) => {
  if (typeof config === 'function') return (props: any) => config(props);
  return (props: any) => (
    <BaseNode id={props.id} data={props.data} selected={props.selected} {...props} {...config} />
  );
};
