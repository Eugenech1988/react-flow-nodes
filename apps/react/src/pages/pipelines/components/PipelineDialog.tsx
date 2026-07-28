import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/shared/hooks';
import { Workflow, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import {
  FloatingInput,
  FloatingTextarea,
  FloatingSelect,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/shared/ui';
import { usePipelineHandler } from '@/pages/pipelines/hooks';
import {
  createPipelineInputSchema,
  updatePipelineInputSchema,
} from '@pipeline/contracts';
import type { TPipeline } from '@/shared/lib';
import { z } from 'zod';

interface TPipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'update';
  initialData?: TPipeline | null;
}

type TPipelineStatusOption = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

type TCreateFormData = z.infer<typeof createPipelineInputSchema>;
type TUpdateFormData = z.infer<typeof updatePipelineInputSchema>;
type TFormData = TCreateFormData & TUpdateFormData & {
  status?: TPipelineStatusOption;
};

const STATUS_OPTIONS: { value: TPipelineStatusOption; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export const PipelineDialog = ({
                                 isOpen,
                                 onClose,
                                 mode = 'create',
                                 initialData,
                               }: TPipelineDialogProps) => {
  const { user } = useUser();
  const isCreate = mode === 'create';

  const { createPipeline, updatePipeline } = usePipelineHandler({
    onCreateSuccess: () => handleClose(),
    onUpdateSuccess: () => handleClose(),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(
      isCreate ? createPipelineInputSchema : updatePipelineInputSchema
    ) as any,
    defaultValues: {
      name: '',
      description: '',
      screenshotUrl: '',
      status: 'DRAFT',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData && !isCreate) {
        const rawStatus = initialData.status
          ? (String(initialData.status).toUpperCase() as TPipelineStatusOption)
          : 'DRAFT';

        reset({
          id: initialData.id,
          name: initialData.name ?? '',
          description: initialData.description ?? '',
          status: rawStatus,
        });
      } else {
        reset({
          name: '',
          description: '',
          screenshotUrl: '',
          status: 'DRAFT',
        });
      }
    }
  }, [isOpen, initialData, isCreate, reset]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    handleRemoveFile();
    createPipeline.reset();
    updatePipeline.reset();
    onClose();
  };

  const onSubmit = (data: TFormData) => {
    if (isCreate) {
      if (!user?.id) return;
      createPipeline.mutate(
        { userId: user.id, data, file: file ?? undefined },
        { onSuccess: handleClose }
      );
    } else if (initialData?.id) {
      const updatePayload = {
        id: initialData.id,
        name: data.name,
        description: data.description,
        status: data.status,
      };

      updatePipeline.mutate(updatePayload as any, {
        onSuccess: handleClose,
      });
    }
  };

  const isPending = createPipeline.isPending || updatePipeline.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border border-border bg-card p-0 gap-0 overflow-hidden rounded-xl shadow-xs backdrop-blur-xs"
      >
        <DialogHeader
          title={isCreate ? 'Create Pipeline' : 'Update Pipeline'}
          description={
            isCreate
              ? 'Configure your new automation workflow'
              : 'Edit your pipeline details'
          }
          icon={<Workflow className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody withBorder className="space-y-4">
            <FloatingInput
              rounded="lg"
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

            {!isCreate && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FloatingSelect
                    label="Status"
                    rounded="lg"
                    value={field.value || 'DRAFT'}
                    onChange={(val: any) => {
                      const value =
                        typeof val === 'object' && val !== null
                          ? val.target?.value ?? val.value
                          : val;
                      field.onChange(value);
                    }}
                    options={STATUS_OPTIONS}
                    error={!!errors.status}
                    errorMessage={errors.status?.message}
                  />
                )}
              />
            )}

            {isCreate && (
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/25 hover:bg-white/35 text-white text-xs font-medium transition-colors backdrop-blur-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/85 hover:bg-red-500 text-white text-xs font-medium transition-colors backdrop-blur-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter
            onCancel={handleClose}
            isPending={isPending}
            submitText={isCreate ? 'Create Pipeline' : 'Save Changes'}
            pendingText={isCreate ? 'Creating...' : 'Saving...'}
            withBorder={false}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};