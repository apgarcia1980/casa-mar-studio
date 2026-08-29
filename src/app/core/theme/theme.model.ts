export const themes = ['system', 'light', 'dark', 'high-contrast'] as const;
export type Theme = (typeof themes)[number];
export function isTheme(value: string | null): value is Theme {
  return value !== null && themes.includes(value as Theme);
}
