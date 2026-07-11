import { useState } from 'react';
import { useStore } from '@/entities/pipeline';
import { Button, Dialog } from '@/shared/ui';

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

  const handleClose = () => {
    setResult(null);
    setError(null);
  };

  const isModalOpen = result !== null || error !== null;

  return (
    <>
      <Button
        variant="default"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded-full shadow-md hover:shadow-lg hover:scale-101 active:scale-98 font-semibold tracking-wide transition-all bg-(--md-primary) text-(--md-on-primary) hover:bg-(--md-primary-hover) border-none px-6 py-2"
      >
        {isSubmitting ? 'Analyzing…' : 'Submit Pipeline'}
      </Button>

      <Dialog
        isOpen={isModalOpen}
        onClose={handleClose}
        title={error ? 'Submission Failed' : 'Pipeline Analysis'}
        className="bg-(--background)"
      >
        <div className="flex flex-col gap-5 p-1 bg-card text-card-foreground">
          {error ? (
            <div className="flex flex-col gap-4 rounded-xl p-4 bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-500 font-semibold text-base">
                <span>✕</span>
                Error Details
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Make sure your backend API is online and accepting connections at port 8000.
                </p>
              </div>
            </div>
          ) : (
            result && (
              <div className="flex flex-col gap-6 bg-card text-card-foreground">
                <div className="grid grid-cols-3 gap-4 text-center select-none">
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-border/60">
                    <span className="text-2xl font-bold text-card-foreground">
                      {result.num_nodes}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Nodes
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-border/60">
                    <span className="text-2xl font-bold text-card-foreground">
                      {result.num_edges}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Edges
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-border/60">
                    <span
                      className={`text-2xl font-bold ${
                        result.is_dag ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {result.is_dag ? 'Yes' : 'No'}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Valid DAG
                    </span>
                  </div>
                </div>

                <div
                  className={`flex flex-col gap-2 rounded-xl p-4 border ${
                    result.is_dag
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {result.is_dag
                      ? '✓ Success! No cycles detected — your workflow is a valid Directed Acyclic Graph (DAG) and ready to run.'
                      : '⚠ Validation Failed: Cycle detected! This pipeline contains loops. Please remove connections that cycle back to earlier nodes.'}
                  </p>
                </div>
              </div>
            )
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="default"
              onClick={handleClose}
              className="w-full sm:w-auto rounded-full px-6 py-2 bg-(--md-primary) text-(--md-on-primary) hover:bg-(--md-primary-hover) border-none font-medium shadow-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};