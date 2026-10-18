/**
 * Map of the authentic Steam recording (cases_footage.mp4, 1920×1080, 20 fps, 80.6 s, no audio).
 *
 * Source timeline (seconds in the recording):
 *   0.0 – 14.5   Danger Zone Case — item page (≈3 s), lifetime chart, month/year switch
 *  16.0 – 19.6   Danger Zone Case — year chart, tooltip scrub: peak 08/05/2026 $2.64 → 16/10/2026 $1.39
 *  21.5 – 23.5   Steam Market list of CS2 cases
 *  24.6 – 28.0   Fracture Case — item page
 *  30.0 – 37.0   Fracture Case — year chart, tooltip: 17/10/2026 $0.55 (f672), 11/05/2026 $1.01 (f724)
 *  38.0 – 39.5   Market list
 *  40.5 – 50.5   Prisma 2 Case — item page (≈44 s) and year chart (decline from spring peak)
 *  52.0 – 54.0   Market list
 *  54.9 – 57.5   Spectrum 2 Case — item page and chart (mostly flat — not used as a "falling" example)
 *  58.0 – 61.5   Loading / market list
 *  62.7 – 66.0   Fever Case — item page and year chart (gradual decline, 17/10/2026 $0.83)
 *  68.0 – 72.0   Market list
 *  73.5 – 78.0   Dreams & Nightmares Case — year chart: 20/04/2026 $2.39 (f1482), 17/10/2026 $1.32 (f1520)
 *  78.0 – 80.6   Dreams & Nightmares Case — item page
 *
 * Every price below was read from a Steam tooltip visible in the recording at the listed frame.
 * Stills in public/stills were extracted with ffmpeg `select=eq(n,FRAME)` from the source file.
 */

export type Point = {x: number; y: number};
export type Rect = {x: number; y: number; w: number; h: number};

export const SOURCE = {
  file: 'cases_footage.mp4',
  width: 1920,
  height: 1080,
  fps: 20,
} as const;

export const still = (name: string) => `stills/${name}.png`;

export type ChartStory = {
  name: string;
  /** Chart panel in source pixels (includes the "Median Sale Prices" header). */
  chart: Rect;
  peak: {still: string; frame: number; point: Point; date: string; price: number; label: string};
  now: {still: string; frame: number; point: Point; date: string; price: number; label: string};
  art: {still: string; crop: Rect};
};

export const FRACTURE: ChartStory = {
  name: 'FRACTURE CASE',
  chart: {x: 390, y: 560, w: 1125, h: 390},
  peak: {still: 'fr_peak', frame: 724, point: {x: 1000, y: 666}, date: '11/05/2026', price: 1.01, label: 'МАЙ'},
  now: {still: 'fr_now', frame: 672, point: {x: 1395, y: 770}, date: '17/10/2026', price: 0.55, label: 'СЕЙЧАС'},
  art: {still: 'fr_page', crop: {x: 520, y: 470, w: 420, h: 300}},
};

export const DREAMS: ChartStory = {
  name: 'DREAMS & NIGHTMARES',
  chart: {x: 390, y: 440, w: 1125, h: 380},
  peak: {still: 'dn_peak', frame: 1482, point: {x: 947, y: 519}, date: '20/04/2026', price: 2.39, label: 'АПРЕЛЬ'},
  now: {still: 'dn_now', frame: 1520, point: {x: 1395, y: 631}, date: '17/10/2026', price: 1.32, label: 'СЕЙЧАС'},
  art: {still: 'dn_page', crop: {x: 480, y: 85, w: 400, h: 200}},
};

export const DANGER_ZONE: ChartStory = {
  name: 'DANGER ZONE CASE',
  chart: {x: 270, y: 330, w: 1360, h: 460},
  peak: {still: 'dz_peak', frame: 334, point: {x: 1006, y: 421}, date: '08/05/2026', price: 2.64, label: 'МАЙ'},
  now: {still: 'dz_now', frame: 380, point: {x: 1489, y: 568}, date: '16/10/2026', price: 1.39, label: 'СЕЙЧАС'},
  art: {still: 'dz_page', crop: {x: 545, y: 375, w: 330, h: 200}},
};

/** Charts used for the "other cases" montage — names only, no extra numbers. */
export const MONTAGE = [
  {name: 'PRISMA 2 CASE', still: 'pr_chart', chart: {x: 390, y: 590, w: 1125, h: 360}},
  {name: 'DANGER ZONE CASE', still: 'dz_now', chart: DANGER_ZONE.chart},
  {name: 'FEVER CASE', still: 'fe_chart', chart: {x: 390, y: 520, w: 1125, h: 370}},
] as const;

export const CASE_ART = [
  {name: 'Fracture', still: 'fr_page', crop: FRACTURE.art.crop},
  {name: 'Dreams & Nightmares', still: 'dn_page', crop: DREAMS.art.crop},
  {name: 'Danger Zone', still: 'dz_page', crop: DANGER_ZONE.art.crop},
  {name: 'Prisma 2', still: 'pr_page', crop: {x: 520, y: 420, w: 350, h: 250}},
  {name: 'Spectrum 2', still: 'sp_page', crop: {x: 580, y: 400, w: 380, h: 260}},
  {name: 'Fever', still: 'fe_page', crop: {x: 580, y: 410, w: 380, h: 260}},
] as const;

/** Order book headers on the Fracture page (same scroll position as fr_now). */
export const FRACTURE_ORDERS = {
  still: 'fr_now',
  forSale: {x: 535, y: 170, w: 240, h: 25},
  buyRequests: {x: 1067, y: 170, w: 310, h: 25},
};

export const MARKET_LIST = {still: 'market_list', area: {x: 500, y: 60, w: 900, h: 980}};

/** Live (moving) source segments, in seconds of the recording. */
export const LIVE = {
  /** Danger Zone year chart: cursor runs from the May peak to mid-October. Ends exactly on dz_now (f380). */
  dangerZoneScrub: {from: 16.1, to: 19.0},
  /** Dreams & Nightmares: cursor climbs to the April peak and drops to October. Ends on dn_now (f1520). */
  dreamsScrub: {from: 73.6, to: 76.0},
} as const;

export const dropPercent = (from: number, to: number) => Math.round(((from - to) / from) * 100);
