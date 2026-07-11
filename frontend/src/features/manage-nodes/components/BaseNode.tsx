import { type JSX, type ChangeEvent, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useStore } from '@/entities';
import { AutosizeTextarea } from '@/shared/ui/custom/AutosizeTextarea.tsx';
import { Input, Select } from '@/shared/ui';
import type {
  FieldConfig,
  HandleConfig,
  NodeComponentProps,
  NodeConfig,
  NodeData,
  NodeFieldValues,
} from '@/entities';
import type { CSSProperties, ReactNode } from 'react';
import { extractVariables } from '@/features/manage-nodes';

type Side = 'left' | 'right';

const sideOf = (handle: HandleConfig): Side => {
  const position = handle.position || (handle.type === 'target' ? Position.Left : Position.Right);
  return position === Position.Left ? 'left' : 'right';
};

const withEvenSpacing = (sideHandles: HandleConfig[]): HandleConfig[] =>
  sideHandles.map((handle, index) => ({
    ...handle,
    style: handle.style || { top: `${((index + 1) / (sideHandles.length + 1)) * 100}%` },
  }));

const withAutoPositions = (handles: HandleConfig[]): HandleConfig[] => {
  const bySide: Record<Side, HandleConfig[]> = { left: [], right: [] };
  handles.forEach((handle) => bySide[sideOf(handle)].push(handle));

  return [...withEvenSpacing(bySide.left), ...withEvenSpacing(bySide.right)];
};

const buildInitialValues = (fields: FieldConfig[], data: NodeData, id: string): NodeFieldValues => {
  const initialValues: NodeFieldValues = {};
  fields.forEach((field) => {
    const fallbackValue = typeof field.defaultValue === 'function' ? field.defaultValue(id) : field.defaultValue;
    initialValues[field.key] = data[field.key] ?? fallbackValue ?? '';
  });
  return initialValues;
};

const toVariableHandle = (variable: string): HandleConfig => ({
  id: `var-${variable}`,
  type: 'target',
  position: Position.Left,
});

const inputFieldClassName =
  'bg-background/50 border-slate-200 dark:border-zinc-800 transition-colors hover:border-slate-300 dark:hover:border-zinc-700';

const NodeHandles = ({ handles, type }: { handles: HandleConfig[]; type: 'target' | 'source' }) => (
  <>
    {handles.map((handle) => (
      <Handle
        key={handle.id}
        type={type}
        position={handle.position || (type === 'target' ? Position.Left : Position.Right)}
        id={handle.id}
        style={handle.style}
        className="w-2.5 h-2.5 border-2 border-card rounded-full bg-[var(--node-accent)]"
      />
    ))}
  </>
);

const NodeHeader = ({
                      title,
                      icon,
                      onDelete,
                    }: {
  title?: string;
  icon?: ReactNode;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60 bg-muted/10 rounded-t-2xl select-none">
    <div className="flex items-center gap-3">
      {icon && (
        <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-semibold shadow-xs shrink-0 bg-[var(--node-accent)]">
          {icon}
        </span>
      )}
      <span className="text-sm font-semibold tracking-wide text-card-foreground">{title}</span>
    </div>

    <button
      onClick={onDelete}
      className="nodrag nopan flex items-center justify-center w-5 h-5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-xs font-bold"
      title="Delete node"
    >
      ✕
    </button>
  </div>
);

const NodeField = ({
                     field,
                     value,
                     onChange,
                   }: {
  field: FieldConfig;
  value: NodeFieldValues[string];
  onChange: (value: string) => void;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
      {field.label}
    </span>

    {field.type === 'select' ? (
      <div className="relative">
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          options={field.options}
          className="w-full appearance-none bg-background/50 border-slate-200 dark:border-zinc-800 pr-8 transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    ) : field.type === 'textarea' ? (
      <AutosizeTextarea
        value={String(value)}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className={`font-mono text-xs ${inputFieldClassName}`}
      />
    ) : (
      <Input
        type={field.type || 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputFieldClassName}
      />
    )}
  </label>
);

const VariableTags = ({ variables }: { variables: string[] }) => {
  if (variables.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {variables.map((variable) => (
        <span
          key={variable}
          className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
        >
          {variable}
        </span>
      ))}
    </div>
  );
};

export interface BaseNodeProps extends NodeComponentProps, NodeConfig {
  withVariables?: boolean;
}

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
                         }: BaseNodeProps) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const { deleteElements } = useReactFlow();

  const [values, setValues] = useState<NodeFieldValues>(() => buildInitialValues(fields, data, id));

  const handleFieldChange = (key: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [key]: value }));
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

  return (
    <div
      style={nodeStyle}
      data-category={category}
      className="base-node relative rounded-2xl border border-border bg-card text-card-foreground shadow-md transition-shadow hover:shadow-lg duration-150 overflow-visible text-left"
    >
      <NodeHandles handles={targetHandles.map((h) => ({ ...h, id: `${id}-${h.id}` }))} type="target" />

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
        </div>
      )}

      <NodeHandles handles={sourceHandles.map((h) => ({ ...h, id: `${id}-${h.id}` }))} type="source" />
    </div>
  );
};

type NodeConfigFactory = NodeConfig | ((props: NodeComponentProps) => JSX.Element);

export const createNode = (config: NodeConfigFactory) => {
  if (typeof config === 'function') {
    return ({ id, data }: NodeComponentProps) => config({ id, data });
  }

  return ({ id, data }: NodeComponentProps) => <BaseNode id={id} data={data} {...config} />;
};