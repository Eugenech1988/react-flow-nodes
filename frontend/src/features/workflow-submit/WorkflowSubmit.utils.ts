import { useState } from 'react';
import { useStore } from '@/entities';
import { validatePipeline } from '@/entities/model/lib';
import type { ParseResult, ValidationMetrics } from './WorkflowSubmit.types';

export const useWorkflowSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [validation, setValidation] = useState<ValidationMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const reset = () => {
    setResult(null);
    setValidation(null);
    setError(null);
    setLocalErrors([]);
    setIsConnecting(false);
    setIsSubmittedSuccessfully(false);
  };

  const submit = async () => {
    const { nodes, edges } = useStore.getState();
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setLocalErrors([]);
    setIsConnecting(false);
    setIsSubmittedSuccessfully(false);

    const clientReport = validatePipeline(nodes, edges);
    setValidation(clientReport);
    setLocalErrors(clientReport.errors);

    if (!clientReport.isValid) {
      setError('Workflow schema failed requirements. Please review guidelines below.');
      setIsSubmitting(false);
      return;
    }

    setIsConnecting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockServerData: ParseResult = {
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag: clientReport.isDag,
      };

      setResult(mockServerData);
      setIsSubmittedSuccessfully(true);

      setValidation({
        isDag: mockServerData.is_dag,
        requiredFieldsFilled: clientReport.requiredFieldsFilled,
        outputConnected: clientReport.outputConnected,
        noIsolatedNodes: clientReport.noIsolatedNodes,
        noCycles: mockServerData.is_dag,
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
      setIsConnecting(false);
    }
  };

  return {
    isSubmitting,
    isConnecting,
    isSubmittedSuccessfully,
    result,
    validation,
    error,
    localErrors,
    submit,
    reset,
  };
};