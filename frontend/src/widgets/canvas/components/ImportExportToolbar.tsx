import { useRef } from 'react';
import { Button } from '@/shared/ui';

interface ImportExportToolbarProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export const ImportExportToolbar = ({ onExport, onImport }: ImportExportToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    event.target.value = '';
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={onExport}
        className="h-8 px-4 text-xs font-medium rounded-[var(--radius)] shadow-md transition-all duration-300 border border-transparent cursor-pointer select-none
          bg-[#0f172a] dark:bg-[var(--header-bg)]
          text-white dark:text-[var(--foreground)]
          border-transparent dark:border-[var(--border)]
          hover:bg-[#1e293b] dark:hover:bg-[var(--accent)]
          hover:shadow-lg"
      >
        Export
      </Button>

      <Button
        variant="default"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 px-4 text-xs font-medium rounded-[var(--radius)] shadow-md transition-all duration-300 border border-transparent cursor-pointer select-none
          bg-[#0f172a] dark:bg-[var(--header-bg)]
          text-white dark:text-[var(--foreground)]
          border-transparent dark:border-[var(--border)]
          hover:bg-[#1e293b] dark:hover:bg-[var(--accent)]
          hover:shadow-lg"
      >
        Import
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};