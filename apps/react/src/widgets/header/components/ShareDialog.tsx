import { useMemo, useState } from 'react';
import { Check, Clipboard, Link2, Share2 } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { useUser } from '@/shared/hooks';
import { AppButton, DialogBody, DialogHeader } from '@/shared/ui';

export const ShareDialog = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const pipelineId = user?.currentPipeline?.id;

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.search = '';
    if (pipelineId) url.searchParams.set('pipeline', String(pipelineId));
    return url.toString();
  }, [pipelineId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <>
      <AppButton
        text="Share"
        icon={Share2}
        variant="primary"
        size="xs"
        onClick={() => setIsOpen(true)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="border-border bg-card gap-0 overflow-hidden rounded-xl border p-0 sm:max-w-md"
        >
          <DialogHeader
            title="Share workflow"
            description="Anyone with this link can open this workflow."
            icon={<Link2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
            onClose={() => setIsOpen(false)}
          />
          <DialogBody withBorder>
            <div className="border-border bg-muted/30 flex items-center gap-2 rounded-lg border p-2">
              <input
                readOnly
                value={shareUrl}
                aria-label="Workflow share link"
                className="text-foreground min-w-0 flex-1 bg-transparent px-1 text-xs outline-none"
                onFocus={(event) => event.currentTarget.select()}
              />
              <AppButton
                text={isCopied ? 'Copied' : 'Copy link'}
                icon={isCopied ? Check : Clipboard}
                variant="primary"
                size="xs"
                onClick={handleCopy}
              />
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
};
