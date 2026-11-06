import type { Variants } from 'framer-motion';
import { BrainCircuit, Send, ShieldBan, Workflow } from 'lucide-react';

export const USE_CASES = [
  {
    id: '01',
    title: 'LLM & Agentic Orchestration',
    category: 'AI & Inference',
    description:
      'Chain multi-step prompts, validate schema boundaries between models, and integrate custom vector database tools via standard API nodes.',
    icon: BrainCircuit,
    metric: 'Latency: < 15ms',
    rotation: '-rotate-1',
    offset: 'md:-mt-4',
  },
  {
    id: '02',
    title: 'Notification Dispatcher',
    category: 'Messaging',
    description:
      'Route real-time alerts dynamically across Slack, email, and Webhooks based on user action payloads and custom conditional rules.',
    icon: Send,
    metric: 'Volume: 1.2M/day',
    rotation: 'rotate-2',
    offset: 'md:mt-20',
  },
  {
    id: '03',
    title: 'Lightweight ETL Pipelines',
    category: 'Data Processing',
    description:
      'Extract payloads from incoming webhooks, transform fields in real-time, and securely batch load clean datasets straight to Postgres.',
    icon: Workflow,
    metric: 'Type: Event-driven',
    rotation: 'rotate-1',
    offset: 'md:-mt-8',
  },
  {
    id: '04',
    title: 'Auto-Mitigation Workflows',
    category: 'SecOps',
    description:
      'Trigger security logic when an anomaly is detected. Block IP addresses on Cloudflare and rotate API tokens instantly without human delay.',
    icon: ShieldBan,
    metric: 'SLA: 100% Guaranteed',
    rotation: '-rotate-2',
    offset: 'md:mt-16',
  },
];

export const UC_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const  UC_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (custom: { rot: string }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: custom.rot.includes('-') ? -1.5 : 1.5,
    transition: { type: 'spring', stiffness: 70, damping: 15 },
  }),
};