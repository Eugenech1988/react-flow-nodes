import { Network, Sliders, Play, Activity, Flame } from 'lucide-react';
import type { THowItWorksSteps } from './types';

export const HOW_IT_WORKS_STEPS: THowItWorksSteps[] = [
  {
    id: 'design',
    title: 'Drag and Connect Nodes',
    subtitle: 'Design Phase',
    description:
      'Select from over 100+ pre-built triggers, actions, and logical operators. Drag them onto the zero-lag canvas and route your data by connecting matching output-to-input ports.',
    icon: Network,
  },
  {
    id: 'validate',
    title: 'Configure Payloads',
    subtitle: 'Validation Phase',
    description:
      'Click on any node to open its properties. Map incoming JSON fields, write custom mapping expressions with autocomplete support, and let our strict schema engine validate your connections.',
    icon: Sliders,
  },
  {
    id: 'deploy',
    title: 'Deploy and Run',
    subtitle: 'Production Phase',
    description:
      'Hit Deploy to publish your workspace. Your workflow immediately compiles into a highly optimized, stateful execution pipeline running on global edge nodes.',
    icon: Play,
  },
  {
    id: 'monitor',
    title: 'Monitor Pipeline Health',
    subtitle: 'Telemetry Phase',
    description:
      'Watch real-time pressure gauges and throughput metrics. Our built-in observability suite catches bottlenecks before they cause a system failure.',
    icon: Activity,
  },
  {
    id: 'scale',
    title: 'Scale Infrastructure',
    subtitle: 'Expansion Phase',
    description:
      'Allocate more compute to your boilers. The system automatically provisions additional edge workers to handle traffic spikes without breaking a sweat.',
    icon: Flame,
  },
];
