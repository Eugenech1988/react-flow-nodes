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
import { X, CheckCircle2, AlertTriangle, Play, HelpCircle, Loader2 } from 'lucide-react';

// const PARSE_ENDPOINT = 'http://localhost:8000/pipelines/parse';

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [validation, setValidation] = useState<ValidationMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const handleClose = () => {
    setResult(null);
    setValidation(null);
    setError(null);
    setLocalErrors([]);
    setIsConnecting(false);
    setIsSubmittedSuccessfully(false);
  };

  const handleSubmit = async () => {
    const { nodes, edges } = useStore.getState();
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setLocalErrors([]);
    setIsConnecting(false);
    setIsSubmittedSuccessfully(false);

    // 1. Запуск локальной валидации схемы
    const clientReport = validatePipeline(nodes, edges);
    setValidation(clientReport);
    setLocalErrors(clientReport.errors);

    if (!clientReport.isValid) {
      setError('Workflow schema failed requirements. Please review guidelines below.');
      setIsSubmitting(false);
      return;
    }

    // 2. Локальная валидация успешно пройдена — показываем лоадер соединения с бэком
    setIsConnecting(true);

    try {
      // Имитация задержки соединения с бэкендом (1.5 секунды)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      /* --- РЕАЛЬНЫЙ СЕТЕВОЙ ЗАПРОС К БЭКЕНДУ ЗАКОММЕНТИРОВАН ---
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
      ---------------------------------------------------------- */

      // Имитируем успешный ответ от сервера на основе текущего состояния Flow
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

  const isModalOpen = validation !== null || error !== null || isConnecting || isSubmittedSuccessfully;

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
        className="cursor-pointer h-10 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-2.5 transition-all font-medium tracking-wide flex items-center gap-2"
      >
        <Play className="h-4 w-4 fill-current" />
        {isSubmitting ? 'Validating schema…' : 'Execute Workflow'}
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent showCloseButton={false} className={`sm:max-w-xl p-6 gap-5 rounded-2xl transition-all duration-300 ${isSubmittedSuccessfully ? 'border-emerald-500/30' : ''}`}>
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

          {/* ЭКРАН 1: Фаза подключения к бэкенду */}
          {isConnecting && (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-blue-500/5 border border-blue-500/15 rounded-xl gap-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Local validation passed successfully!</p>
                <p className="text-sm text-muted-foreground mt-1">Connecting to backend environment and parsing active routes...</p>
              </div>
            </div>
          )}

          {/* ЭКРАН 2: Успешный результат отправки (Скрывает чек-лист валидации и скроллбары) */}
          {isSubmittedSuccessfully && result && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center py-6 px-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl gap-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Workflow Sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">Pipeline is verified, connected to the runtime, and ready to launch.</p>
                </div>
              </div>

              {/* Статистика активных нод */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/15">
                  <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{result.num_nodes}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Active Nodes</div>
                </div>
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/15">
                  <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{result.num_edges}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Active Links</div>
                </div>
              </div>
            </div>
          )}

          {/* ЭКРАН 3: Ошибки локальной валидации (показывается только при наличии проблем) */}
          {validation && !isConnecting && !isSubmittedSuccessfully && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {validationRules.map((rule) => (
                  <div key={rule.label} className="flex flex-col justify-between p-3.5 bg-secondary/35 border border-border/30 rounded-xl transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold tracking-tight text-foreground/90">{rule.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        rule.status
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15'
                      }`}>
                        {rule.status ? 'OK' : 'MISCONFIGURED'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 leading-tight">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              {localErrors.length > 0 && (
                <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/15">
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block mb-2">Required Adjustments ({localErrors.length})</span>
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
              variant={isSubmittedSuccessfully ? "default" : "secondary"}
              className={`rounded-full px-6 py-2.5 h-10 text-sm font-medium cursor-pointer ml-auto transition-all ${
                isSubmittedSuccessfully
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 border-0'
                  : ''
              }`}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};