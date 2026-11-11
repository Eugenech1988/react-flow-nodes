import { Cpu, Database, Flame, Globe, Terminal, Wind, type LucideIcon } from 'lucide-react';

export type TCompany = {
  name: string;
  icon: LucideIcon;
};

export const COMPANIES: TCompany[] = [
  { name: 'Synapse', icon: Cpu },
  { name: 'PrismDB', icon: Database },
  { name: 'Aether', icon: Flame },
  { name: 'Orbit', icon: Globe },
  { name: 'Shell', icon: Terminal },
  { name: 'Gale', icon: Wind },
];
