let revalidateTimeout: ReturnType<typeof setTimeout> | null = null;

export async function triggerPortalRevalidate(): Promise<void> {
  const portalUrl = import.meta.env.VITE_PORTAL_URL;
  const secret = import.meta.env.VITE_REVALIDATE_SECRET;

  if (!portalUrl || !secret) {
    console.warn('[revalidate] VITE_PORTAL_URL or VITE_REVALIDATE_SECRET is not set');
    return;
  }

  if (revalidateTimeout) clearTimeout(revalidateTimeout);

  revalidateTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`${portalUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
      });
      if (!res.ok) console.warn('[revalidate] Failed:', res.status);
      else console.debug('[revalidate] Portal cache invalidated');
    } catch (err) {
      console.warn('[revalidate] Network error:', err);
    }
  }, 500);
}
