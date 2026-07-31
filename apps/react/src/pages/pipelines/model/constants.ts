export const TAB_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PAUSED', label: 'Paused' },
  { id: 'DRAFT', label: 'Draft' },
  { id: 'ARCHIVED', label: 'Archived' },
];

export type TTabType = (typeof TAB_OPTIONS)[number]['id'];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'status', label: 'Status' },
];

export type TSortOption = (typeof SORT_OPTIONS)[number];
