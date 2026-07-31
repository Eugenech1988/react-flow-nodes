import { AppButton } from '@/shared/ui';
import { LocalAlert } from '@/shared/ui';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useDangerZoneSection } from '../hooks';

export const DangerZoneSection = () => {
  const {
    isOpen,
    isPending,
    alert,
    open,
    close,
    confirm
  } = useDangerZoneSection();

  return (
    <div className="border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 rounded-xl p-6 space-y-4">
      {alert && (
        <LocalAlert
          hasSuccess={false}
          hasError
          alertMessage={alert.message}
        />
      )}

      <h4 className="text-sm font-semibold tracking-wider text-rose-600">
        Danger Zone
      </h4>

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-sm font-semibold text-foreground">
            Delete Account
          </span>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated pipelines data.
          </p>
        </div>

        <AppButton
          variant="danger"
          onClick={open}
          isPending={isPending}
          text="Delete Account"
        />
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