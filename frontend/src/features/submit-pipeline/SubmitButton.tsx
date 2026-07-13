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
import { X } from 'lucide-react';

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

  const handleSubmit = async () => {
    const { nodes, edges } = useStore.getState();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const clientReport = validatePipeline(nodes, edges);
    setValidation(clientReport);

    if (!clientReport.isValid) {
      setError('Pipeline configuration failed local architecture checks.');
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
        throw new Error(`Server responded with status ${response.status}`);
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
        setError("Couldn't reach the backend. Is it running on localhost:8000?");
      } else if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError('Something went wrong while submitting the pipeline.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isModalOpen = validation !== null || error !== null;

  const validationRules = validation ? [
    { label: 'Graph is DAG', status: validation.isDag },
    { label: 'Required fields filled', status: validation.requiredFieldsFilled },
    { label: 'Output connected', status: validation.outputConnected },
    { label: 'Input Connected', status: validation.inputConnected },
    { label: 'No isolated nodes', status: validation.noIsolatedNodes },
    { label: 'No cycles', status: validation.noCycles },
    { label: 'Variable exists', status: validation.variableExists },
    { label: 'No duplicate variables', status: validation.noDuplicateVariables },
  ] : [];

  return (
    <>
      <Button
        variant="default"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="cursor-pointer h-9 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-2.5 transition-all font-medium tracking-wide"
      >
        {isSubmitting ? 'Analyzing…' : 'Submit Pipeline'}
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setResult(null);
            setValidation(null);
            setError(null);
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md p-6 gap-6 rounded-2xl">
          <DialogClose className="cursor-pointer absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 hover:bg-[var(--secondary)] focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {error && !result ? 'Verification Warning' : 'Pipeline Analysis'}
            </DialogTitle>
          </DialogHeader>

          {validation && (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {validationRules.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between p-3 bg-secondary/40 border border-border/40 rounded-xl transition-colors">
                  <span className="text-sm font-medium">{rule.label}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    rule.status
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}>
                    {rule.status ? '✔ Pass' : '✕ Fail'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              <p className="font-medium text-destructive mb-1">{error}</p>
              {!result && (
                <p className="text-sm text-muted-foreground">
                  Please review the checklist parameters above and fix any structural violations in your canvas before re-submitting.
                </p>
              )}
            </div>
          )}

          {result && !error && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-secondary/50 p-3 rounded-xl text-center border border-border/50">
                <div className="text-xl font-bold">{result.num_nodes}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Nodes</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-xl text-center border border-border/50">
                <div className="text-xl font-bold">{result.num_edges}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Edges</div>
              </div>
            </div>
          )}

          <DialogFooter className="bg-transparent">
            <Button
              variant="secondary"
              className="rounded-full px-8 py-5 cursor-pointer"
              onClick={() => { setResult(null); setValidation(null); setError(null); }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};