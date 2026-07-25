import { type ChangeEvent, type ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AutosizeTextarea } from '@/shared/ui';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pipeline/ui';
import type { FieldConfig, HandleConfig, NodeFieldValues } from '@/entities';
import { inputFieldClassName } from './BaseNode.utils';

export const NodeHandles = ({ handles, type }: { handles: HandleConfig[]; type: 'target' | 'source' }) => (
  <>
    {handles.map((handle) => (
      <Handle
        key={handle.id}
        type={type}
        position={handle.position || (type === 'target' ? Position.Left : Position.Right)}
        id={handle.id}
        style={handle.style}
        className="w-2.5 h-2.5 border-2 border-card rounded-full bg-(--node-accent)"
      />
    ))}
  </>
);

export const NodeHeader = ({
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
        <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-semibold shadow-xs shrink-0 bg-(--node-accent)">
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

export const NodeField = ({
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
      <div className="nodrag nopan pointer-events-auto">
        <Select
          value={String(value)}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full h-9 bg-background/50 border-slate-200 dark:border-zinc-800 transition-colors hover:border-slate-300 dark:hover:border-zinc-700 rounded-md px-3 text-left font-normal text-xs">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="nodrag nopan">
            {field.options?.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                className="text-xs cursor-pointer"
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
          className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
        >
          {variable}
        </span>
      ))}
    </div>
  );
};