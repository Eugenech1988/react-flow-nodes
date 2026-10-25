import { useEffect, type RefObject } from 'react';

const resizeTextarea = (
  textarea: HTMLTextAreaElement,
  onHeightChange?: (height: number) => void,
) => {
  textarea.style.height = 'auto';
  const contentHeight = textarea.scrollHeight;
  textarea.style.height = `${contentHeight}px`;
  onHeightChange?.(contentHeight);
};

export const useAutosizeTextarea = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  onHeightChange?: (height: number) => void,
) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    resizeTextarea(textarea, onHeightChange);
  }, [textareaRef, value, onHeightChange]);
};
