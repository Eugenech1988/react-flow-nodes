import { AppButton } from '@/shared/ui';

interface JobFormHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function JobFormHeader({ isEditing, isSubmitting, onCancel }: JobFormHeaderProps) {
  return (
    <div className="bg-background/80 border-border z-10 flex items-center justify-between py-4 backdrop-blur-md">
      <h1 className="text-2xl font-bold">{isEditing ? 'Edit Vacancy' : 'New Vacancy'}</h1>
      <div className="flex gap-3">
        <AppButton
          type="button"
          variant="secondary"
          size="md"
          text="Cancel"
          onClick={onCancel}
          isDisabled={isSubmitting}
        />
        <AppButton
          type="submit"
          variant="primary"
          size="md"
          isPending={isSubmitting}
          pendingText="Saving..."
          text={isEditing ? 'Save Changes' : 'Create Vacancy'}
        />
      </div>
    </div>
  );
}