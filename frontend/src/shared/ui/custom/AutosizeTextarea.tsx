import { useRef, type ComponentPropsWithoutRef, type ChangeEvent, type Ref } from 'react';
import { Textarea } from '@/shared';
import { useAutosizeTextarea } from '@/features/manage-nodes';

interface AutosizeTextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  ref?: Ref<HTMLTextAreaElement>;
}

export const AutosizeTextarea = ({
                                   value,
                                   onChange,
                                   className,
                                   ref,
                                   ...props
                                 }: AutosizeTextareaProps) => {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  useAutosizeTextarea(internalRef.current, value);

  return (
    <Textarea
      {...props}
      ref={(el: HTMLTextAreaElement | null) => {
        internalRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }
      }}
      value={value}
      onChange={onChange}
      className={`resize-none overflow-hidden ${className || ''}`}
    />
  );
};