import { DraggableNode } from '@/features/manage-nodes';

interface ToolbarNodeItem {
  type: string;
  label: string;
  icon: string;
}

interface ToolbarGroup {
  label: string;
  nodes: ToolbarNodeItem[];
}

const nodeGroups: ToolbarGroup[] = [
  {
    label: 'I/O',
    nodes: [
      { type: 'customInput', label: 'Input', icon: '→' },
      { type: 'customOutput', label: 'Output', icon: '⇥' },
    ],
  },
  {
    label: 'Content',
    nodes: [
      { type: 'text', label: 'Text', icon: '✎' },
      { type: 'image', label: 'Image', icon: '▧' },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      { type: 'llm', label: 'LLM', icon: '✨' },
      { type: 'math', label: 'Math', icon: '∑' },
      { type: 'conditional', label: 'Condition', icon: '⑂' },
    ],
  },
  {
    label: 'Integrations',
    nodes: [
      { type: 'api', label: 'API', icon: '⇄' },
      { type: 'database', label: 'Database', icon: '⛁' },
    ],
  },
];

export const Toolbar = () => {
  return (
    <div className="flex items-center gap-8 px-6 py-3 bg-card border-b border-border/60 overflow-x-auto shrink-0 select-none transition-colors duration-300">
      {nodeGroups.map((group) => (
        <div className="flex flex-col gap-1.5 shrink-0" key={group.label}>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {group.label}
          </span>
          <div className="flex items-center gap-2">
            {group.nodes.map((nodeConfig) => (
              <DraggableNode
                key={nodeConfig.type}
                type={nodeConfig.type}
                label={nodeConfig.label}
                icon={nodeConfig.icon}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
