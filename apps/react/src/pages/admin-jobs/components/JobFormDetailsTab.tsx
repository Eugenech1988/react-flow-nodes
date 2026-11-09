import { Controller, type UseFormRegister, type FieldErrors, type Control } from 'react-hook-form';
import { FloatingInput, FloatingSelect } from '@/shared/ui';
import type { TJobDepartment, TJobLevel, TJobType, TJobStatus } from '@pipeline/contracts';
import { DEPT_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, STATUS_OPTIONS } from '../model';
import type { TJobFormInput, TJobFormOutput } from '../model';

interface JobFormDetailsTabProps {
  register: UseFormRegister<TJobFormInput>;
  control: Control<TJobFormInput, unknown, TJobFormOutput>;
  errors: FieldErrors<TJobFormInput>;
}

export function JobFormDetailsTab({ register, control, errors }: JobFormDetailsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <FloatingInput
          {...register('slug')}
          label="Slug (unique)"
          error={!!errors.slug}
          errorMessage={errors.slug?.message}
          className="font-mono"
        />
      </div>

      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <FloatingSelect
            label="Department"
            value={field.value}
            onChange={(v) => field.onChange(v as TJobDepartment)}
            options={DEPT_OPTIONS}
            error={!!errors.department}
            errorMessage={errors.department?.message}
          />
        )}
      />

      <Controller
        name="level"
        control={control}
        render={({ field }) => (
          <FloatingSelect
            label="Level"
            value={field.value}
            onChange={(v) => field.onChange(v as TJobLevel)}
            options={LEVEL_OPTIONS}
            error={!!errors.level}
            errorMessage={errors.level?.message}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FloatingSelect
            label="Type"
            value={field.value}
            onChange={(v) => field.onChange(v as TJobType)}
            options={TYPE_OPTIONS}
            error={!!errors.type}
            errorMessage={errors.type?.message}
          />
        )}
      />

      <FloatingInput
        {...register('location')}
        label="Location"
        error={!!errors.location}
        errorMessage={errors.location?.message}
      />

      <FloatingInput
        {...register('icon')}
        label="Icon (Lucide name)"
        placeholder="code-2"
        error={!!errors.icon}
        errorMessage={errors.icon?.message}
        className="font-mono"
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FloatingSelect
            label="Status"
            value={field.value}
            onChange={(v) => field.onChange(v as TJobStatus)}
            options={STATUS_OPTIONS}
            error={!!errors.status}
            errorMessage={errors.status?.message}
          />
        )}
      />
    </div>
  );
}