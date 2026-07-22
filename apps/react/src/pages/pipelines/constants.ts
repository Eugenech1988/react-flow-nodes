export const TAB_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'draft', label: 'Draft' },
] as const;

export type TabType = (typeof TAB_OPTIONS)[number]['id'];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'status', label: 'Status' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];
