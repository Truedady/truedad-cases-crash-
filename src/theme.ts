export const COLORS = {
  navy: '#08132F',
  navyDeep: '#040A1C',
  navySoft: '#0E1E45',
  cyan: '#43C5F5',
  orange: '#FF923E',
  white: '#F8FAFF',
  muted: 'rgba(248, 250, 255, 0.62)',
} as const;

export const FONTS = {
  display: 'TD Display, Inter, sans-serif',
  bold: 'TD Bold, Inter, sans-serif',
  body: 'TD Body, Inter, sans-serif',
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Mobile safe area: keep text clear of platform UI.
// Top ~220px (status / search), bottom ~440px (captions, music row),
// right ~120px from y≈900 down (like / comment / share buttons).
export const SAFE = {
  left: 64,
  right: 1080 - 96,
  top: 220,
  bottom: 1480,
} as const;
