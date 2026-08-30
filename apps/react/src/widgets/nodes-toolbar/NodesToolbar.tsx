import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

export const NodesToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence initial={false} mode="wait">
      {isOpen ? (
        <motion.aside
          key="node-library"
          aria-label="Node library"
          initial={{ opacity: 0, x: -14, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -14, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="border-border/80 bg-card/95 absolute top-16 left-4 z-30 max-h-[calc(100%-5rem)] w-56 overflow-y-auto rounded-xl border p-3 shadow-lg backdrop-blur select-none"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-card-foreground text-sm font-semibold">Nodes</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[10px]">Drag to canvas</span>
              <button
                type="button"
                aria-label="Close node library"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {nodeGroups.map((group) => (
            <section
              className="border-border/60 border-t py-2.5 first:border-t-0 first:pt-0"
              key={group.label}
            >
              <span className="text-muted-foreground/80 text-[9px] font-bold tracking-wider uppercase">
                {group.label}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {group.nodes.map((nodeConfig) => (
                  <DraggableNode
                    key={nodeConfig.type}
                    type={nodeConfig.type}
                    label={nodeConfig.label}
                    icon={nodeConfig.icon}
                  />
                ))}
              </div>
            </section>
          ))}
        </motion.aside>
      ) : (
        <motion.button
          key="open-node-library"
          type="button"
          aria-label="Open node library"
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, x: -8, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.9 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="border-border/80 bg-card/95 text-foreground hover:bg-accent absolute top-16 left-4 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-lg backdrop-blur transition-colors"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
