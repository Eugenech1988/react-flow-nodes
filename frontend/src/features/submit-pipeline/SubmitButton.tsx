import { useState } from 'react';
import { useStore } from '@/entities';
import { Button, DialogClose } from '@/shared/ui';
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

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const { nodes, edges } = useStore.getState();
    setIsSubmitting(true);
    setError(null);

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

  const isModalOpen = result !== null || error !== null;

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
              {error ? 'Submission Failed' : 'Pipeline Analysis'}
            </DialogTitle>
          </DialogHeader>

          {error ? (
            <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              <p className="font-medium text-destructive mb-1">{error}</p>
              <p className="text-sm text-muted-foreground">
                Check your backend console. Ensure the server is active on port 8000 and CORS is enabled.
              </p>
            </div>
          ) : (
            result && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border/50">
                    <div className="text-2xl font-bold">{result.num_nodes}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      Nodes
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border/50">
                    <div className="text-2xl font-bold">{result.num_edges}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      Edges
                    </div>
                  </div>
                  <div className={`bg-secondary/50 p-4 rounded-xl text-center border ${result.is_dag ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
                    <div className={`text-2xl font-bold ${result.is_dag ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {result.is_dag ? 'Yes' : 'No'}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      Valid DAG
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl flex items-center gap-3 ${result.is_dag ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                  <span className="text-sm font-medium">
                    {result.is_dag
                      ? 'Your workflow is correctly structured as a Directed Acyclic Graph.'
                      : 'Cycle detected in your workflow. Please review your connections.'}
                  </span>
                </div>
              </div>
            )
          )}

          <DialogFooter className="bg-transparent">
            <Button
              variant="secondary"
              className="rounded-full px-8 py-5 cursor-pointer"
              onClick={() => { setResult(null); setError(null); }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};