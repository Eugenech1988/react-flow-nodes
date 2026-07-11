import type { CSSProperties, DragEvent } from 'react';

interface DraggableNodeProps {
  type: string;
  label: string;
  icon?: string;
}

const categoryVar: Record<string, string> = {
  customInput: 'var(--node-input)',
  customOutput: 'var(--node-output)',
  text: 'var(--node-text)',
  llm: 'var(--node-llm)',
  math: 'var(--node-math)',
  conditional: 'var(--node-logic)',
  api: 'var(--node-api)',
  database: 'var(--node-data)',
  image: 'var(--node-media)',
};

export const DraggableNode = ({ type, label, icon }: DraggableNodeProps) => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    const appData = { nodeType };
    event.currentTarget.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.cursor = 'grab';
  };

  const accentColor = categoryVar[type] || 'var(--node-default)';
  const chipStyle: CSSProperties & { '--accent': string } = {
    '--accent': accentColor,
    borderColor: accentColor,
    color: accentColor,
  };

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 bg-card border rounded-full text-[13px] font-medium cursor-grab hover:bg-muted/30 active:cursor-grabbing hover:shadow-xs select-none transition-all duration-150"
      style={chipStyle}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      {icon && <span className="text-sm shrink-0">{icon}</span>}
      <span className="text-foreground">{label}</span>
    </div>
  );
};
