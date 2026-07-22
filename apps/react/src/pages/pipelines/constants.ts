import type { IPipeline } from './types';

export const TAB_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'draft', label: 'Draft' },
] as const;

export type TabType = (typeof TAB_OPTIONS)[number]['id'];

export const MOCK_PIPELINES: IPipeline[] = [
  {
    id: '1',
    name: 'Customer Onboarding Sync',
    description: 'Sync new user signups from Stripe to HubSpot CRM and send welcome email.',
    status: 'active',
    lastRunStatus: 'success',
    lastRunAt: '10 minutes ago',
    updatedAt: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Daily Financial Reporting',
    description: 'Aggregate daily sales transactions and upload summary report to S3.',
    status: 'active',
    lastRunStatus: 'failed',
    lastRunAt: 'Yesterday at 23:00',
    updatedAt: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Inventory Sync Automation',
    description: 'Fetch stock updates from warehouse API and update Shopify inventory.',
    status: 'paused',
    lastRunStatus: 'success',
    lastRunAt: '3 days ago',
    updatedAt: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
];

export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
];