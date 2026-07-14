import { useState } from 'react';
import { useStore } from '@/entities';
import { Button, DialogClose } from '@/shared/ui';
import { validatePipeline } from '@/entities/model/lib';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { X, CheckCircle2, AlertTriangle, Play, HelpCircle } from 'lucide-react';

const PARSE_ENDPOINT = 'http://localhost:8000/pipelines/parse';

interface ParseResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

interface ValidationMetrics {
  isDag: boolean;
  inputConnected: boolean;
  requiredFieldsFilled: boolean;
  outputConnected: boolean;
  noIsolatedNodes: boolean;
  noCycles: boolean;
  variableExists: boolean;
  noDuplicateVariables: boolean;
}

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [validation, setValidation] = useState<ValidationMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    const { nodes, edges } = useStore.getState();
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setLocalErrors([]);

    const clientReport = validatePipeline(nodes, edges);
    setValidation(clientReport);
    setLocalErrors(clientReport.errors);

    if (!clientReport.isValid) {
      setError('Workflow schema failed requirements. Please review guidelines below.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(PARSE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server execution error: ${response.status}`);
      }

      const data = (await response.json()) as ParseResult;
      setResult(data);

      setValidation({
        isDag: data.is_dag,
        requiredFieldsFilled: clientReport.requiredFieldsFilled,
        outputConnected: clientReport.outputConnected,
        noIsolatedNodes: clientReport.noIsolatedNodes,
        noCycles: data.is_dag,
        inputConnected: clientReport.inputConnected,
        variableExists: clientReport.variableExists,
        noDuplicateVariables: clientReport.noDuplicateVariables,
      });
    } catch (submitError) {
      if (submitError instanceof TypeError) {
        setError('Cannot establish bridge connection to local runtime at localhost:8000.');
      } else if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError('An unexpected error occurred while parsing workflow metadata.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isModalOpen = validation !== null || error !== null;

  const validationRules = validation ? [
    { label: 'Execution flow (DAG)', status: validation.isDag, desc: 'Structure matches execution standards' },
    { label: 'Parameters configured', status: validation.requiredFieldsFilled, desc: 'All active node properties are defined' },
    { label: 'Terminal output linked', status: validation.outputConnected, desc: 'Exit nodes have active incoming steps' },
    { label: 'Variables mapped', status: validation.inputConnected, desc: 'Dynamic placeholders are linked' },
    { label: 'No stranded elements', status: validation.noIsolatedNodes, desc: 'No nodes are left fully disconnected' },
    { label: 'Closed loops absent', status: validation.noCycles, desc: 'Flow does not contain circular execution routes' },
    { label: 'Defined keys only', status: validation.variableExists, desc: 'All template parameters exist' },
    { label: 'Unique namespaces', status: validation.noDuplicateVariables, desc: 'Parameter namespaces do not overlap' },
  ] : [];

  return (
    <>
      <Button
        variant="default"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="cursor-pointer h-9 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-2.5 transition-all font-medium tracking-wide flex items-center gap-2"
      >
        <Play className="h-4 w-4 fill-current" />
        {isSubmitting ? 'Validating schema…' : 'Execute Workflow'}
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setResult(null);
            setValidation(null);
            setError(null);
            setLocalErrors([]);
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-lg p-6 gap-6 rounded-2xl">
          <DialogClose className="cursor-pointer absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 hover:bg-[var(--secondary)] focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {error && !result ? (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Execution Blocked
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Workflow Validated
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {validation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-1">
              {validationRules.map((rule) => (
                <div key={rule.label} className="flex flex-col justify-between p-3 bg-secondary/35 border border-border/30 rounded-xl transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold tracking-tight text-foreground/90">{rule.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      rule.status
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15'
                    }`}>
                      {rule.status ? 'OK' : 'MISCONFIGURED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 leading-none">
                    <HelpCircle className="h-3 w-3 shrink-0" />
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {localErrors.length > 0 && (
            <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/15">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block mb-2">Required Adjustments ({localErrors.length})</span>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-muted-foreground">
                {localErrors.map((err, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result && !error && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
              <div className="bg-secondary/40 p-3 rounded-xl text-center border border-border/40">
                <div className="text-xl font-extrabold tracking-tight">{result.num_nodes}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Active Nodes</div>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl text-center border border-border/40">
                <div className="text-xl font-extrabold tracking-tight">{result.num_edges}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Active Links</div>
              </div>
            </div>
          )}

          <DialogFooter className="bg-transparent gap-2">
            <Button
              variant="secondary"
              className="rounded-full px-6 py-2 h-9 text-xs cursor-pointer ml-auto"
              onClick={() => { setResult(null); setValidation(null); setError(null); setLocalErrors([]); }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};