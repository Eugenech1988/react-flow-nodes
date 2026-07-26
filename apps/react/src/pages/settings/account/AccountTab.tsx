import { AccountForm } from './components';
import { useAccountForm } from './hooks/useAccountForm';

export const AccountTab = () => {
  const account = useAccountForm();

  return (
    <AccountForm
      form={account.form}
      alert={account.alert}
      onSubmit={account.onSubmit}
      isPristine={account.isPristine}
      isPending={account.isPending}
      user2fa={account.user2fa}
      onToggle2fa={account.onToggle2fa}
      is2faPending={account.is2faPending}
      onDeleteAccount={account.onDeleteAccount}
      isDeletePending={account.isDeletePending}
      onGenerate2faSecret={account.onGenerate2faSecret}
    />
  );
};