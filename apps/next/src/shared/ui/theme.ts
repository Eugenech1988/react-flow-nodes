export type TUiTheme = 'default' | 'careers' | 'blog';

export const themeScope = (theme?: TUiTheme) => (theme ? { 'data-theme': theme } : undefined);
