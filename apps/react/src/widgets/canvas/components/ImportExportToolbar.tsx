import { useRef } from 'react';
import { Upload, Download } from 'lucide-react';

export const ImportExportToolbar = ({
  onExport,
  onImport,
}: {
  onExport: () => void;
  onImport: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImport(file);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <button
        onClick={onExport}
        className="border-border bg-card text-card-foreground hover:bg-accent flex h-8.5 cursor-pointer items-center gap-1.5 rounded-(--radius) border px-3 py-1.5 text-xs font-medium shadow-md transition-colors"
      >
        <Download size={16} />
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="border-border bg-card text-card-foreground hover:bg-accent flex h-8.5 cursor-pointer items-center gap-1.5 rounded-(--radius) border px-3 py-1.5 text-xs font-medium shadow-md transition-colors"
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
