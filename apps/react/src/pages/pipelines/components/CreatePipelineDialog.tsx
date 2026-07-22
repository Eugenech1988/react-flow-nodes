import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/shared/hooks';
import { Workflow, X, Loader2, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@pipeline/ui';
import { FloatingInput, FloatingTextarea } from '@/shared/ui';
import { createPipelineSchema, type CreatePipelineDto } from '../types';
import { useCreatePipeline } from '../hooks/usePipelineHandler';

interface CreatePipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePipelineDialog = ({ isOpen, onClose }: CreatePipelineDialogProps) => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePipelineDto>({
    resolver: zodResolver(createPipelineSchema),
    defaultValues: { name: '', description: '', screenshotUrl: '' },
  });

  const createMutation = useCreatePipeline();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    handleRemoveFile();
    createMutation.reset();
    onClose();
  };

  const onSubmit = (data: CreatePipelineDto) => {
    if (!user?.id) return;
    createMutation.mutate({ userId: user.id, data, file });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border border-border bg-card p-0 rounded-xl shadow-xs overflow-hidden backdrop-blur-xs"
      >
        <DialogHeader className="px-6 py-4 border-b border-border/60 bg-muted/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <div>
              <DialogTitle className="text-base font-medium text-foreground/90">
                Create Pipeline
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure your new automation workflow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-2 pb-6 space-y-6">
          <div className="space-y-4">
            <FloatingInput
              {...register('name')}
              id="name"
              label="Pipeline Name *"
              error={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <FloatingTextarea
              {...register('description')}
              id="description"
              label="Description"
              fieldsetClasses="rounded-lg"
              error={!!errors.description}
              errorMessage={errors.description?.message}
              rows={3}
            />

            <div className="space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full h-36 rounded-xl border border-dashed border-input bg-muted/20 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all overflow-hidden cursor-pointer flex flex-col items-center justify-center"
              >
                {!filePreview ? (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="p-2.5 rounded-full bg-background border border-border shadow-2xs group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Select Screenshot
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        PNG, JPG or WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={filePreview}
                      alt="Pipeline preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors backdrop-blur-md"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition-colors backdrop-blur-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-4 py-4.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Pipeline</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};