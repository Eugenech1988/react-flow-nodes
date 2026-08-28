import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/widgets/sidebar/model';

export const SidebarToggle = () => {
  const toggle = useSidebarStore(state => state.toggle);
  const isOpen = useSidebarStore(state => state.isOpen);
  return (<button
    onClick={toggle}
    className="absolute left-4 top-4 z-10 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-lg border bg-background shadow-md hover:bg-accent"
  >
    {isOpen ? <PanelLeftClose/> : <PanelLeftOpen/>}
  </button>);
};