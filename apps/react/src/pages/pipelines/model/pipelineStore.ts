import { create } from 'zustand';
import type { TPipeline } from '@/shared/lib';

interface PipelineDialogState {
  isOpen: boolean;
  mode: 'create' | 'update';
  pipelineToEdit: TPipeline | null;
  openCreateModal: () => void;
  openUpdateModal: (pipeline: TPipeline) => void;
  closeModal: () => void;
}

export const usePipelineDialogStore = create<PipelineDialogState>((set) => ({
  isOpen: false,
  mode: 'create',
  pipelineToEdit: null,
  openCreateModal: () => set({ isOpen: true, mode: 'create', pipelineToEdit: null }),
  openUpdateModal: (pipeline) => set({ isOpen: true, mode: 'update', pipelineToEdit: pipeline }),
  closeModal: () => set({ isOpen: false, pipelineToEdit: null }),
}));