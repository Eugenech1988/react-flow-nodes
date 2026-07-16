import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImportExportToolbar } from './ImportExportToolbar';

describe('ImportExportToolbar', () => {
  const onExportMock = vi.fn();
  const onImportMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders export and import buttons correctly', () => {
    render(<ImportExportToolbar onExport={onExportMock} onImport={onImportMock}/>);

    expect(screen.getByRole('button', {name: /export/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /import/i})).toBeInTheDocument();
  });

  it('calls onExport when the Export button is clicked', () => {
    render(<ImportExportToolbar onExport={onExportMock} onImport={onImportMock}/>);

    const exportButton = screen.getByRole('button', {name: /export/i});
    fireEvent.click(exportButton);

    expect(onExportMock).toHaveBeenCalledTimes(1);
  });

  it('triggers file input click when the Import button is clicked', () => {
    render(<ImportExportToolbar onExport={onExportMock} onImport={onImportMock}/>);

    const fileInput = screen.getByAcceptAttribute
      ? screen.getByAttribute('accept', '.json')
      : document.querySelector('input[type="file"]') as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    const clickSpy = vi.spyOn(fileInput, 'click');

    const importButton = screen.getByRole('button', {name: /import/i});
    fireEvent.click(importButton);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onImport with the correct file when a JSON file is selected', () => {
    render(<ImportExportToolbar onExport={onExportMock} onImport={onImportMock}/>);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['{"nodes":[],"edges":[]}'], 'pipeline.json', {type: 'application/json'});

    fireEvent.change(fileInput, {
      target: {files: [file]}
    });

    expect(onImportMock).toHaveBeenCalledTimes(1);
    expect(onImportMock).toHaveBeenCalledWith(file);
  });

  it('does not call onImport if no file was selected', () => {
    render(<ImportExportToolbar onExport={onExportMock} onImport={onImportMock}/>);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {files: []}
    });

    expect(onImportMock).not.toHaveBeenCalled();
  });
});