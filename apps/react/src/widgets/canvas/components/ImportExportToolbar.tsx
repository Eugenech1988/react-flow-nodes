import { useRef } from 'react';
import { Upload, Download } from 'lucide-react';

export const ImportExportToolbar = ({ onExport, onImport }: { onExport: () => void, onImport: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImport(file);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <button
        onClick={onExport}
        className="flex items-center cursor-pointer h-8.5 gap-1.5 px-3 py-1.5 bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] text-xs font-medium rounded-[var(--radius)] shadow-md hover:bg-[var(--accent)] transition-colors"
      >
        <Download size={16} />
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center cursor-pointer h-8.5 gap-1.5 px-3 py-1.5 bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] text-xs font-medium rounded-[var(--radius)] shadow-md hover:bg-[var(--accent)] transition-colors"
      >
        <Upload size={16} />
        Import
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};