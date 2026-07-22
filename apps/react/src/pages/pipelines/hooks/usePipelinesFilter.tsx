import { useState, useCallback, type ChangeEvent } from 'react';
import { debounce } from '@/shared/lib';
import type { IPipeline, TTabType } from '../types';

export const usePipelinesFilter = (initialPipelines: IPipeline[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TTabType>('all');

  const updateDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateDebouncedSearch(value);
  };

  const filteredPipelines = initialPipelines.filter((pipeline) => {
    const matchesSearch =
      pipeline.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      pipeline.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    searchQuery,
    statusFilter,
    setStatusFilter,
    handleSearchChange,
    filteredPipelines,
  };
};