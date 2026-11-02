import { AppButton } from '@/shared/ui';
import { LocalAlert } from '@/shared/ui';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useDangerZoneSection } from '../hooks';

export const DangerZoneSection = () => {
  const { isOpen, isPending, alert, open, close, confirm } = useDangerZoneSection();

  return (
    <div className="space-y-4 rounded-xl border border-rose-200/80 bg-rose-50/60 p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
      {alert && <LocalAlert hasSuccess={false} hasError alertMessage={alert.message} />}

      <h4 className="text-sm font-semibold tracking-wider text-rose-600">Danger Zone</h4>

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-foreground text-sm font-semibold">Delete Account</span>
          <p className="text-muted-foreground text-sm">
            Permanently delete your account and all associated pipelines data.
          </p>
        </div>

        <AppButton variant="danger" onClick={open} isPending={isPending} text="Delete Account" />
      </div>

      <DeleteAccountModal
        isOpen={isOpen}
        onClose={close}
        onConfirm={confirm}
        isDeletePending={isPending}
      />
    </div>
  );
};
