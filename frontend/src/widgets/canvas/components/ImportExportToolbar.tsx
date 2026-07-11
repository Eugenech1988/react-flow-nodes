import { useRef } from 'react';

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
    event.target.value = ''; // Сбрасываем значение, чтобы можно было загрузить тот же файл повторно
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <button
        onClick={onExport}
        className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Import
      </button>
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