import { AppButton } from '@/shared/ui';
import { Briefcase } from 'lucide-react'; // Можно использовать любую иконку по смыслу

interface JobFormHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function JobFormHeader({ isEditing, isSubmitting, onCancel }: JobFormHeaderProps) {
  return (
    <div className="bg-background/80 border-border/60 z-10 flex flex-col justify-between gap-4 border-b pb-6 backdrop-blur-md sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Vacancy' : 'New Vacancy'}
          </h1>
        </div>

        {/* Вот тут добавляем описание */}
        <p className="text-muted-foreground text-sm">
          {isEditing
            ? 'Update the details, translations, and status of this vacancy.'
            : 'Fill in the details below to create and publish a new job opening.'}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
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