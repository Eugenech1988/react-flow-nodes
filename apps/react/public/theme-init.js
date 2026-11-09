(() => {
  try {
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const isDark = theme === 'dark' || (!theme && systemDark);

    document.documentElement.classList.toggle('dark', isDark);
  } catch {
    // Ignore storage access errors
  }
})();