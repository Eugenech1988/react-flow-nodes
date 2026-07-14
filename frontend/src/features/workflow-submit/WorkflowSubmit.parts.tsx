import { DialogClose } from '@/shared/ui';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui';
import { X, CheckCircle2, AlertTriangle, Loader2, HelpCircle } from 'lucide-react';
import type { ParseResult, ValidationMetrics } from './WorkflowSubmit.types';

const VALIDATION_RULES: Array<{
  key: keyof ValidationMetrics;
  label: string;
  desc: string;
}> = [
  { key: 'isDag', label: 'Execution flow (DAG)', desc: 'Structure matches execution standards' },
  { key: 'requiredFieldsFilled', label: 'Parameters configured', desc: 'All active node properties are defined' },
  { key: 'outputConnected', label: 'Terminal output linked', desc: 'Exit nodes have active incoming steps' },
  { key: 'inputConnected', label: 'Variables mapped', desc: 'Dynamic placeholders are linked' },
  { key: 'noIsolatedNodes', label: 'No stranded elements', desc: 'No nodes are left fully disconnected' },
  { key: 'noCycles', label: 'Closed loops absent', desc: 'Flow does not contain circular execution routes' },
  { key: 'variableExists', label: 'Defined keys only', desc: 'All template parameters exist' },
  { key: 'noDuplicateVariables', label: 'Unique namespaces', desc: 'Parameter namespaces do not overlap' },
];

interface WorkflowSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isConnecting: boolean;
  isSubmittedSuccessfully: boolean;
  result: ParseResult | null;
  validation: ValidationMetrics | null;
  error: string | null;
  localErrors: string[];
  onClose: () => void;
}

export const WorkflowSubmitModal = ({
                                      open,
                                      onOpenChange,
                                      isConnecting,
                                      isSubmittedSuccessfully,
                                      result,
                                      validation,
                                      error,
                                      localErrors,
                                      onClose,
                                    }: WorkflowSubmitModalProps) => {
  const getValidationStatus = (key: keyof ValidationMetrics) => {
    return validation ? validation[key] : false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`sm:max-w-xl p-6 gap-5 rounded-2xl transition-all duration-300 ${
          isSubmittedSuccessfully ? 'border-emerald-500/30' : ''
        }`}
      >
        <DialogClose className="cursor-pointer absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 hover:bg-[var(--secondary)] focus:outline-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Dismiss</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {error && !isSubmittedSuccessfully ? (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> Execution Blocked
              </span>
            ) : isConnecting ? (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin" /> Local Validation OK
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" /> Submitted Successfully
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isConnecting && (
          <div className="flex flex-col items-center justify-center py-6 px-4 bg-blue-500/5 border border-blue-500/15 rounded-xl gap-3">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                Local validation passed successfully!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Connecting to backend environment and parsing active routes...
              </p>
            </div>
          </div>
        )}

        {isSubmittedSuccessfully && result && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl gap-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  Workflow Sent!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pipeline is verified, connected to the runtime, and ready to launch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/15">
                <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {result.num_nodes}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                  Active Nodes
                </div>
              </div>
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/15">
                <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {result.num_edges}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                  Active Links
                </div>
              </div>
            </div>
          </div>
        )}

        {validation && !isConnecting && !isSubmittedSuccessfully && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VALIDATION_RULES.map((rule) => {
                const status = getValidationStatus(rule.key);
                return (
                  <div
                    key={rule.key}
                    className="flex flex-col justify-between p-3.5 bg-secondary/35 border border-border/30 rounded-xl transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold tracking-tight text-foreground/90">
                        {rule.label}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          status
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15'
                        }`}
                      >
                        {status ? 'OK' : 'MISCONFIGURED'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 leading-tight">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      {rule.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {localErrors.length > 0 && (
              <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/15">
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block mb-2">
                  Required Adjustments ({localErrors.length})
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-muted-foreground">
                  {localErrors.map((err, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="bg-transparent gap-2">
          <Button
            variant={isSubmittedSuccessfully ? 'default' : 'secondary'}
            className={`rounded-full px-6 py-2.5 h-10 text-sm font-medium cursor-pointer ml-auto transition-all ${
              isSubmittedSuccessfully
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 border-0'
                : ''
            }`}
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};