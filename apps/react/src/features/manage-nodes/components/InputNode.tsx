import { useState, useRef, type DragEvent } from 'react';
import { Position } from '@xyflow/react';
import { Input } from '@pipeline/ui';
import { Upload, FileText, X } from 'lucide-react';
import { createNode } from './BaseNode';
import { inputFieldClassName } from './BaseNode/BaseNode.utils';

export const InputNode = createNode({
  title: 'Input',
  subtitle: 'Start workflow',
  category: 'input',
  icon: '▶',
  fields: [
    { key: 'inputName', label: 'Field Name', defaultValue: (id) => `input_${id}` },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'file', label: 'File' },
      ],
    },
  ],
  handles: [{ id: 'value', type: 'source', position: Position.Right }],
  children: ({ values, handleFieldChange }) => {
    const isFile = values.inputType === 'file';
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file?: File) => {
      if (!file) return;
      handleFieldChange('inputValue', file.name);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    };

    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-[11px] font-medium select-none">
          {isFile ? 'File Input' : 'Test value'}
        </span>

        {isFile ? (
          <div className="nodrag nopan flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />

            {values.inputValue ? (
              <div className="border-border/80 bg-muted/25 flex items-center justify-between gap-2 rounded-md border p-2 text-xs">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="truncate text-xs font-medium">{values.inputValue}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('inputValue', '')}
                  className="hover:bg-destructive/10 hover:text-destructive rounded p-0.5 transition-colors"
                  title="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-border/80 bg-muted/10 hover:border-[var(--node-accent)]/60 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed p-3 text-center transition-all ${
                  isDragOver ? 'border-[var(--node-accent)] bg-[var(--node-accent)]/10' : ''
                }`}
              >
                <Upload className="text-muted-foreground h-5 w-5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium leading-tight">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-muted-foreground text-[9px]">Any file up to 10MB</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Input
            type="text"
            value={values.inputValue ?? ''}
            onChange={(e) => handleFieldChange('inputValue', e.target.value)}
            className={inputFieldClassName}
          />
        )}
      </div>
    );
  },
});