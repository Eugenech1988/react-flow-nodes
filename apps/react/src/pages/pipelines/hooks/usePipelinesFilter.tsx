import { useState, useMemo } from 'react';
import type { IPipeline } from '../types';
import type { TabType, SortOption } from '../constants';

export const usePipelinesFilter = (
  pipelines: IPipeline[],
  initialSortBy: SortOption['value'] = 'name',
  initialSortOrder: 'asc' | 'desc' = 'asc'
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<SortOption['value']>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPipelines = useMemo(() => {
    let result = pipelines;

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortBy) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'updatedAt':
          valA = new Date(a.updatedAt).getTime();
          valB = new Date(b.updatedAt).getTime();
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        default:
          valA = a.name;
          valB = b.name;
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return result;
  }, [pipelines, searchQuery, statusFilter, sortBy, sortOrder]);

  return {
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleSearchChange,
    setStatusFilter,
    filteredPipelines,
  };
};