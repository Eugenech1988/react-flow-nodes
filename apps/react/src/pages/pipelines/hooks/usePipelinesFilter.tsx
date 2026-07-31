import { useState, useMemo, useCallback } from 'react';
import type { TTabType, TSortOption } from '@/pages/pipelines/model';
import type { TPipeline } from '@/shared/lib';

export const usePipelinesFilter = (
  pipelines: TPipeline[] = [],
  initialSortBy: TSortOption['value'] = 'name',
  initialSortOrder: 'asc' | 'desc' = 'asc'
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TTabType>('all');
  const [sortBy, setSortBy] = useState<TSortOption['value']>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredPipelines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return pipelines
      .filter((pipeline) => {
        const matchesStatus =
          statusFilter === 'all' || pipeline.status?.toUpperCase() === statusFilter.toUpperCase();

        const matchesQuery =
          !q ||
          pipeline.name.toLowerCase().includes(q) ||
          pipeline.description?.toLowerCase().includes(q);

        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (sortBy) {
          case 'name':
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case 'updatedAt':
            valA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            valB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            break;
          case 'status':
            valA = a.status ?? '';
            valB = b.status ?? '';
            break;
          default:
            valA = a.name;
            valB = b.name;
        }

        if (valA === valB) return 0;
        const compareResult = valA > valB ? 1 : -1;
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });
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