import { beforeEach, describe, expect, it } from 'vitest';
import { useSidebarStore } from './sidebarStore';

describe('useSidebarStore', () => {
  beforeEach(() => {
    useSidebarStore.setState({ isOpen: false });
  });

  it('starts closed', () => {
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('toggle flips state', () => {
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(true);

    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('open sets true', () => {
    useSidebarStore.getState().open();
    expect(useSidebarStore.getState().isOpen).toBe(true);
  });

  it('close sets false', () => {
    useSidebarStore.setState({ isOpen: true });
    useSidebarStore.getState().close();
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });
});
