import { useEffect } from 'react';

export const useAutosizeTextarea = (
  textareaRef: HTMLTextAreaElement | null,
  value: string,
  onHeightChange?: (height: number) => void
) => {
  useEffect(() => {
    if (!textareaRef) return;

    textareaRef.style.height = 'auto';
    const contentHeight = textareaRef.scrollHeight;
    textareaRef.style.height = `${contentHeight}px`;
    
    if (onHeightChange) {
      onHeightChange(contentHeight);
    }
  }, [textareaRef, value, onHeightChange]);
};
