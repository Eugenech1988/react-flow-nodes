import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, type Resolver } from 'react-hook-form';
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
  AppButton,
} from '@/shared/ui';
import { usePipelineHandler } from '@/features/manage-pipelines';
import {
  createPipelineInputSchema,
  updatePipelineInputSchema,
  type TCreatePipelineInputData,
  type TUpdatePipelineInputData,
} from '@pipeline/contracts';
import type { TPipeline } from '@/entities';

interface TPipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'update';
  initialData?: TPipeline | null;
}

type TPipelineStatusOption = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

type TFormData = TCreatePipelineInputData &
  Partial<TUpdatePipelineInputData> & {
    status?: TPipelineStatusOption;
  };

const STATUS_OPTIONS: { value: TPipelineStatusOption; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export const PipelineModal = ({
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

  const activeSchema = isCreate ? createPipelineInputSchema : updatePipelineInputSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(activeSchema) as unknown as Resolver<TFormData>,
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
        { data: data as TCreatePipelineInputData, file: file ?? undefined },
        { onSuccess: handleClose },
      );
    } else if (initialData?.id) {
      updatePipeline.mutate(
        {
          id: initialData.id,
          name: data.name,
          description: data.description,
          status: data.status,
        },
        { onSuccess: handleClose },
      );
    }
  };

  const isPending = createPipeline.isPending || updatePipeline.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl border p-0 shadow-xs backdrop-blur-xs sm:max-w-md"
      >
        <DialogHeader
          title={isCreate ? 'Create Pipeline' : 'Update Pipeline'}
          description={
            isCreate ? 'Configure your new automation workflow' : 'Edit your pipeline details'
          }
          icon={<Workflow className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
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
                    onChange={(val) => {
                      const value =
                        typeof val === 'object' && val !== null
                          ? ((val as React.ChangeEvent<HTMLSelectElement>).target?.value ?? val)
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
                  className="group border-input bg-muted/20 relative flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-all hover:border-teal-500/50 hover:bg-teal-500/5"
                >
                  {!filePreview ? (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className="bg-background border-border rounded-full border p-2.5 shadow-2xs transition-transform group-hover:scale-105">
                        <ImageIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="text-foreground text-xs font-medium">Select Screenshot</p>
                        <p className="text-muted-foreground mt-0.5 text-[10px]">
                          PNG, JPG or WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={filePreview}
                        alt="Pipeline preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                        <AppButton
                          variant="ghost"
                          size="xs"
                          text="Change"
                          icon={Upload}
                          onClick={(e) => {
                            e?.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="border-none bg-white/25 text-white backdrop-blur-md hover:bg-white/35"
                        />
                        <AppButton
                          variant="danger"
                          size="xs"
                          text="Delete"
                          icon={Trash2}
                          onClick={handleRemoveFile}
                          className="backdrop-blur-md"
                        />
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
