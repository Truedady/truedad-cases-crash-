import React from 'react';
import {Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Point, SOURCE, still} from '../footage';
import {COLORS, VIDEO} from '../theme';

export type Cam = {f: number; x: number; y: number; s: number};

export type Layer =
  | {kind: 'still'; name: string; fadeIn?: [number, number]}
  /** Plays the source recording from `from` to `to` seconds, starting at frame `start` of the viewport. */
  | {kind: 'video'; from: number; to: number; start?: number};

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Visible part of the recording: excludes browser tabs/address bar (top) and the Windows taskbar (bottom). */
const BOUNDS = {x0: 0, x1: SOURCE.width, y0: 64, y1: 1036};

const clampAxis = (v: number, half: number, lo: number, hi: number) =>
  2 * half >= hi - lo ? (lo + hi) / 2 : Math.min(Math.max(v, lo + half), hi - half);

/** Camera position at a frame, eased between keyframes. */
export const camAt = (cams: Cam[], frame: number): Cam => {
  if (frame <= cams[0].f) return cams[0];
  for (let i = 0; i < cams.length - 1; i++) {
    const a = cams[i];
    const b = cams[i + 1];
    if (frame <= b.f) {
      const p = ease((frame - a.f) / Math.max(1, b.f - a.f));
      // Interpolate zoom logarithmically so push-ins feel linear to the eye.
      const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * p);
      return {f: frame, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, s};
    }
  }
  return cams[cams.length - 1];
};

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  layers: Layer[];
  cams: Cam[];
  radius?: number;
  frameStyle?: 'card' | 'bleed';
  blur?: number;
  dim?: number;
  tag?: string;
  /** Overlay drawn in viewport-local coordinates; `map` converts source pixels to screen. */
  overlay?: (map: (p: Point) => Point, cam: Cam) => React.ReactNode;
};

/**
 * A reframing window onto the landscape Steam recording.
 * The source is never stretched: one uniform scale + translation per frame.
 */
export const Viewport: React.FC<Props> = ({
  x,
  y,
  w,
  h,
  layers,
  cams,
  radius = 34,
  frameStyle = 'card',
  blur = 0,
  dim = 0,
  tag,
  overlay,
}) => {
  const frame = useCurrentFrame();
  const raw = camAt(cams, frame);
  const cam = {
    ...raw,
    x: clampAxis(raw.x, w / (2 * raw.s), BOUNDS.x0, BOUNDS.x1),
    y: clampAxis(raw.y, h / (2 * raw.s), BOUNDS.y0, BOUNDS.y1),
  };
  const left = w / 2 - cam.x * cam.s;
  const top = h / 2 - cam.y * cam.s;
  const map = (p: Point): Point => ({x: w / 2 + (p.x - cam.x) * cam.s, y: h / 2 + (p.y - cam.y) * cam.s});
  const card = frameStyle === 'card';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: card ? radius : 0,
        overflow: 'hidden',
        background: '#1B2129',
        border: card ? '2px solid rgba(67,197,245,0.55)' : undefined,
        boxShadow: card ? '0 0 70px rgba(67,197,245,0.22), 0 40px 90px rgba(0,0,0,0.65)' : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SOURCE.width,
          height: SOURCE.height,
          transform: `translate(${left}px, ${top}px) scale(${cam.s})`,
          transformOrigin: '0 0',
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        {layers.map((layer, i) => {
          if (layer.kind === 'still') {
            const opacity = layer.fadeIn
              ? interpolate(frame, layer.fadeIn, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
              : 1;
            return (
              <Img
                key={i}
                src={staticFile(still(layer.name))}
                style={{position: 'absolute', width: SOURCE.width, height: SOURCE.height, opacity}}
              />
            );
          }
          const dur = Math.round((layer.to - layer.from) * VIDEO.fps);
          return (
            <Sequence key={i} from={layer.start ?? 0} durationInFrames={dur} layout="none">
              <OffthreadVideo
                src={staticFile(SOURCE.file)}
                muted
                startFrom={Math.round(layer.from * VIDEO.fps)}
                style={{position: 'absolute', width: SOURCE.width, height: SOURCE.height}}
              />
            </Sequence>
          );
        })}
      </div>
      {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(4,10,28,${dim})`}} />}
      {card && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 120% 90% at 50% 50%, transparent 70%, rgba(4,10,28,0.45) 100%)',
          }}
        />
      )}
      {overlay?.(map, cam)}
      {tag && (
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 20,
            padding: '8px 18px',
            borderRadius: 999,
            background: 'rgba(8,19,47,0.82)',
            border: '1.5px solid rgba(67,197,245,0.5)',
            color: COLORS.white,
            fontFamily: 'TD Body',
            fontSize: 26,
            letterSpacing: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: 6, background: COLORS.cyan, boxShadow: `0 0 12px ${COLORS.cyan}`}} />
          {tag}
        </div>
      )}
    </div>
  );
};
