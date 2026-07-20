import { Alert, AlertDescription, AlertTitle } from '@pipeline/ui';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ILocalAlertProps {
  hasError: boolean;
  hasSuccess: boolean;
  alertMessage: string;
}

export const LocalAlert = ({hasError, hasSuccess, alertMessage}: ILocalAlertProps) => {
  return (
    <>
      {(hasError || hasSuccess) && (
        <Alert
          variant={hasError ? 'destructive' : 'default'}
          className={
            hasError
              ? 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
              : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }
        >
          {hasError ? (
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400"/>
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500"/>
          )}
          <AlertTitle
            className={hasError ? 'text-red-800 dark:text-red-200' : 'text-emerald-800 dark:text-emerald-200'}>
            {hasError ? 'Error' : 'Success'}
          </AlertTitle>
          <AlertDescription
            className={hasError ? 'text-red-700/90 dark:text-red-300' : 'text-emerald-700/90 dark:text-emerald-300'}>
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};