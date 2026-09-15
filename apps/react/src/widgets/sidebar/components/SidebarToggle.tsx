import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/widgets/sidebar/model';

export const SidebarToggle = () => {
  const toggle = useSidebarStore((state) => state.toggle);
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border bg-background text-foreground shadow-md transition-[background-color,box-shadow] duration-200 hover:bg-accent hover:shadow-lg"
      aria-label="Toggle sidebar"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <PanelLeftClose
          className={`absolute h-4 w-4 transition-[opacity,transform] ${
  isOpen
    ? 'scale-100 opacity-100 duration-300 ease-out'
    : 'scale-90 opacity-0 duration-150 ease-in'
}`}
        />

        <PanelLeftOpen
          className={`absolute h-4 w-4 transition-[opacity,transform] ${
  isOpen
    ? 'scale-90 opacity-0 duration-150 ease-in'
    : 'scale-100 opacity-100 duration-300 ease-out'
}`}
        />
      </span>
    </button>
  );
};
