# TrueDad — Кейсы CS2 падают (Shorts / TikTok)

A vertical Remotion edit of a real Steam screen recording, with the original Russian voiceover.

- **Composition:** `TrueDadCasesShorts`, 1080×1920, 30 fps, 1755 frames (58.5 s; the voiceover is 58.44 s)
- **Output:** `out/TrueDad_Cases_Crash_Shorts.mp4` (H.264 + AAC)

## Source files

| File | Content |
|---|---|
| `cases_script.txt` | Final Russian narration script |
| `cases_voiceover.mp3` | Narration, 58.44 s, 44.1 kHz mono. This is the master timeline. |
| `cases_footage.mp4` | Steam recording: 1920×1080, 20 fps, 80.6 s, no audio track |

`public/` holds identical copies of the two media files, because Remotion serves from `public/`; git stores the duplicates as a single object. `public/stills/` contains frames extracted from the recording with `ffmpeg -vf select=eq(n\,FRAME)`. `public/fonts/` holds Inter, which has full Cyrillic coverage.

## Footage map (source seconds)

| Source time | What's on screen | Used for |
|---|---|---|
| 0–3 | Danger Zone Case item page | case art |
| 16.1–19.0 | Danger Zone year chart, tooltip at **08/05/2026 $2.64** (f334) → **16/10/2026 $1.39** (f380) | hook (plays live), "other cases", final question |
| 24.6–28 | Fracture Case item page | case art, "Смотри сам" |
| 30–37 | Fracture year chart, tooltips at **17/10/2026 $0.55** (f672) and **11/05/2026 $1.01** (f724); order book with "for sale" and "requests to buy" counts | Fracture example, "Где дно?", supply/demand |
| 44–50 | Prisma 2 Case page and year chart (falls from its spring peak) | "other cases" |
| 54.9–57 | Spectrum 2 page and chart (mostly flat, so not used as a "falling" example) | case art only |
| 61.5 | Steam Market list of CS2 cases | main question, "no guarantee" |
| 62.7–66 | Fever Case page and chart (gradual decline) | "other cases", case art |
| 73.6–76 | Dreams & Nightmares year chart, tooltips at **20/04/2026 $2.39** (f1482) → **17/10/2026 $1.32** (f1520) | D&N example, "многие думают" (plays live) |
| 78–80 | Dreams & Nightmares item page | case art |

Every number shown on screen comes from a Steam tooltip visible in the recording. The percentages are calculated from those values: Fracture −46%, Dreams & Nightmares −45%, Danger Zone −47%. Nothing is drawn onto the charts beyond markers on real data points.

## Narration timing

Sentence boundaries were found with `ffmpeg silencedetect` (−35 dB, 0.25 s) and matched to the script. They are listed in `src/timing.ts` (`VO`), and every animation cue is keyed to those times.

## Structure

```
src/
  timing.ts            narration timeline + scene boundaries
  footage.ts           footage map: stills, crops, real data points, prices
  theme.ts             brand colours (#08132F / #43C5F5 / #FF923E / #F8FAFF), safe area
  components/
    Background.tsx     navy gradient, glows, grid, particles
    Viewport.tsx       reframes the landscape recording (uniform scale, eased camera, crossfades, live clips)
    ui.tsx             Headline, Chip, Marker, PriceCard, PercentBadge, CaseArt, SceneWrap
  scenes/
    ChartScenes.tsx    hook, Fracture, Dreams & Nightmares, other cases, quote, "Где дно?", order book, final chart
    TextScenes.tsx     main question, "Смотри сам", transitions, "≠", drops, final CTA
  TrueDadCasesShorts.tsx  scene sequence + voiceover
```

## Commands

```bash
npm install
npm run typecheck
npx remotion studio                       # preview
npx remotion render TrueDadCasesShorts out/TrueDad_Cases_Crash_Shorts.mp4
# in a sandbox with Playwright's Chromium:
#   --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
node scripts/stills.mjs <outDir> <frame> ...   # preview individual frames
```
