import {VIDEO} from './theme';

/** Seconds → composition frames (30 fps). */
export const sec = (s: number) => Math.round(s * VIDEO.fps);

/** Voiceover length measured with ffprobe: 58.436 s. */
export const VOICEOVER_SECONDS = 58.436;
export const DURATION_FRAMES = Math.ceil(VOICEOVER_SECONDS * VIDEO.fps) + 1; // 1755 = 58.5 s

/** Crossfade overlap between consecutive scenes. */
export const OVERLAP = 6;

/**
 * Narration timeline, derived from pause detection on cases_voiceover.mp3
 * (ffmpeg silencedetect, -35 dB / 0.25 s) and matched to cases_script.txt.
 * Times are in seconds of the voiceover.
 */
export const VO = {
  hook: [0.0, 3.86], // Некоторые кейсы КС 2 потеряли почти половину стоимости!
  question: [4.22, 5.41], // И теперь главный вопрос:
  chanceOrTrap: [5.74, 8.7], // это шанс заработать или ловушка для инвесторов?
  seeYourself: [9.07, 9.73], // Смотри сам.
  fractureMay: [10.15, 12.68], // В мае Fracture Case стоил около доллара.
  fractureNow: [12.99, 15.45], // А сейчас — примерно 55 центов.
  dreamsApril: [15.79, 19.72], // Dreams & Nightmares в апреле … почти за два с половиной доллара.
  dreamsNow: [20.01, 21.88], // Теперь — около доллара тридцати.
  otherCases: [22.22, 24.62], // И похожую картину можно увидеть на других кейсах.
  interesting: [25.04, 26.06], // Но вот что интересно.
  manyThink: [26.41, 28.48], // Многие смотрят на такие графики и думают:
  quote: [28.76, 32.32], // «Отлично! Куплю сейчас, а потом продам, когда цена вернётся».
  problem: [32.67, 33.88], // Только есть одна проблема.
  bottom: [34.21, 36.7], // Никто не знает, где находится дно.
  supply: [37.14, 41.36], // На рынке остаются огромные запасы кейсов, а спрос постоянно меняется.
  noGuarantee: [41.7, 46.97], // И даже если какой-то кейс перестаёт выпадать, …не гарантирует…
  notHowMuch: [47.32, 50.89], // Поэтому лично мне сейчас интереснее не то, насколько кейсы упали.
  whatNeeded: [51.21, 54.45], // А что должно произойти, чтобы они снова начали расти?
  final: [54.85, 58.44], // А ты бы сейчас закупал кейсы или ждал дальнейшего падения?
} as const;

/** Scene boundaries in seconds; each scene is cut a little before its line starts. */
export const SCENES = {
  hook: [0, 4.15],
  question: [4.15, 8.85],
  seeYourself: [8.85, 10.05],
  fracture: [10.05, 15.6],
  dreams: [15.6, 22.05],
  market: [22.05, 24.85],
  interesting: [24.85, 26.3],
  manyThink: [26.3, 32.5],
  problem: [32.5, 34.05],
  bottom: [34.05, 37.0],
  supply: [37.0, 41.55],
  noGuarantee: [41.55, 47.15],
  notHowMuch: [47.15, 51.05],
  whatNeeded: [51.05, 54.65],
  final: [54.65, DURATION_FRAMES / VIDEO.fps],
} as const;

export type SceneKey = keyof typeof SCENES;

/** Frame (relative to a scene start) at which a narration time occurs. */
export const at = (scene: SceneKey, voSeconds: number) =>
  sec(voSeconds) - sec(SCENES[scene][0]);
