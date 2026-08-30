import { type ChangeEvent, type ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AutosizeTextarea } from '@/shared/ui';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pipeline/ui';
import type { TFieldConfig, THandleConfig, TNodeFieldValues } from '@/entities';
import { inputFieldClassName } from './BaseNode.utils';

export const NodeHandles = ({
  handles,
  type,
}: {
  handles: THandleConfig[];
  type: 'target' | 'source';
}) => (
  <>
    {handles.map((handle) => (
      <Handle
        key={handle.id}
        type={type}
        position={handle.position || (type === 'target' ? Position.Left : Position.Right)}
        id={handle.id}
        style={handle.style}
        className="border-card h-3 w-3 rounded-full border-2 bg-(--node-accent) shadow-[0_0_0_1px_color-mix(in_srgb,var(--node-accent),transparent_45%)]"
      />
    ))}
  </>
);

export const NodeHeader = ({ icon, onDelete }: { icon?: ReactNode; onDelete: () => void }) => (
  <div className="node-header group flex min-h-28 items-center justify-center select-none">
    {icon && (
      <span className="node-icon flex h-11 w-11 items-center justify-center text-3xl">{icon}</span>
    )}
    <button
      onClick={onDelete}
      className="nodrag nopan text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-xs font-bold opacity-0 transition-all group-hover:opacity-100 focus:opacity-100"
      title="Delete node"
    >
      ✕
    </button>
  </div>
);

export const NodeMeta = ({ title, subtitle }: { title?: string; subtitle?: string }) => (
  <div className="node-meta mt-2 text-center select-none">
    <div className="text-card-foreground text-sm leading-tight font-medium">{title}</div>
    {subtitle && <div className="text-muted-foreground mt-1 text-xs leading-tight">{subtitle}</div>}
  </div>
);

export const NodeField = ({
  field,
  value,
  onChange,
}: {
  field: TFieldConfig;
  value: TNodeFieldValues[string];
  onChange: (value: string) => void;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-muted-foreground text-[11px] font-medium select-none">{field.label}</span>

    {field.type === 'select' ? (
      <div className="nodrag nopan pointer-events-auto">
        <Select value={String(value)} onValueChange={(val) => onChange(val ?? '')}>
          <SelectTrigger className="bg-muted/25 border-border/80 h-8 w-full rounded-md px-2.5 text-left text-xs font-normal transition-colors hover:border-[var(--node-accent)]/60">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="nodrag nopan">
            {field.options?.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                className="cursor-pointer text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

export const VariableTags = ({ variables }: { variables: string[] }) => {
  if (variables.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {variables.map((variable) => (
        <span
          key={variable}
          className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] text-yellow-600"
        >
          {variable}
        </span>
      ))}
    </div>
  );
};
