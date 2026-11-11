export type TUiTheme = 'default' | 'careers' | 'blog';

/**
 * Если тема передана явно, компонент становится собственной «областью темы»:
 * все его дочерние элементы берут цвета из data-theme="..." (в том числе внутри порталов).
 * Если тема не передана, цвета наследуются от ближайшего предка с data-theme.
 */
export const themeScope = (theme?: TUiTheme) => (theme ? { 'data-theme': theme } : undefined);
