export async function triggerPortalRevalidate(): Promise<void> {
  const portalUrl = import.meta.env.VITE_PORTAL_URL;
  const secret = import.meta.env.VITE_REVALIDATE_SECRET;

  if (!portalUrl || !secret) {
    console.warn('[revalidate] VITE_PORTAL_URL or VITE_REVALIDATE_SECRET is not set');
    return;
  }

  try {
    const res = await fetch(`${portalUrl}/src/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': secret,
      },
    });

    if (!res.ok) {
      console.warn('[revalidate] Failed to revalidate portal:', res.status, await res.text());
    } else {
      console.debug('[revalidate] Portal cache successfully invalidated');
    }
  } catch (err) {
    console.warn('[revalidate] Network error:', err);
  }
}