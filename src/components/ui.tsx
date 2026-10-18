import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Rect, still} from '../footage';
import {COLORS} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useAppear = (delay: number, damping = 14, mass = 0.7) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass, stiffness: 140}});
};

const glow = (color: string) =>
  color === COLORS.orange
    ? '0 0 34px rgba(255,146,62,0.55), 0 6px 24px rgba(0,0,0,0.6)'
    : color === COLORS.cyan
      ? '0 0 34px rgba(67,197,245,0.5), 0 6px 24px rgba(0,0,0,0.6)'
      : '0 6px 26px rgba(0,0,0,0.65)';

export type Line = {text: string; color?: string; size?: number; font?: string};

/** Bold stacked typography; each line rises out of a soft blur. */
export const Headline: React.FC<{
  lines: Line[];
  y: number;
  delay?: number;
  stagger?: number;
  align?: 'center' | 'left';
  x?: number;
  width?: number;
  gap?: number;
}> = ({lines, y, delay = 0, stagger = 5, align = 'center', x = 64, width = 952, gap = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: x, top: y, width, textAlign: align}}>
      {lines.map((l, i) => {
        const p = spring({frame: frame - delay - i * stagger, fps, config: {damping: 15, mass: 0.6, stiffness: 150}});
        const size = l.size ?? 96;
        const color = l.color ?? COLORS.white;
        return (
          <div
            key={i}
            style={{
              fontFamily: l.font ?? 'TD Display',
              fontSize: size,
              lineHeight: 1.04,
              letterSpacing: -size * 0.015,
              color,
              textShadow: glow(color),
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.6, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
              filter: `blur(${interpolate(p, [0, 0.7], [10, 0], clamp)}px)`,
              marginBottom: gap,
              whiteSpace: 'nowrap',
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{
  text: string;
  x: number;
  y: number;
  delay?: number;
  color?: string;
  size?: number;
  icon?: React.ReactNode;
}> = ({text, x, y, delay = 0, color = COLORS.cyan, size = 34, icon}) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: 999,
        background: 'rgba(8,19,47,0.88)',
        border: `2px solid ${color}`,
        boxShadow: `0 0 28px ${color}55`,
        color: COLORS.white,
        fontFamily: 'TD Bold',
        fontSize: size,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + p * 0.1})`,
        transformOrigin: 'left center',
      }}
    >
      {icon}
      {text}
    </div>
  );
};

export const Arrow: React.FC<{dir: 'up' | 'down'; color: string; size?: number}> = ({dir, color, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{filter: `drop-shadow(0 0 12px ${color})`, flexShrink: 0}}>
    <g transform={dir === 'down' ? 'rotate(180 32 32)' : undefined}>
      <path d="M32 6 L56 34 H41 V58 H23 V34 H8 Z" fill={color} />
    </g>
  </svg>
);

/** Glowing pulsing ring placed on a real data point of the chart. */
export const Marker: React.FC<{x: number; y: number; color: string; delay: number; size?: number}> = ({
  x,
  y,
  color,
  delay,
  size = 30,
}) => {
  const frame = useCurrentFrame();
  const p = useAppear(delay, 10);
  if (frame < delay) return null;
  const pulse = ((frame - delay) % 36) / 36;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
      <div
        style={{
          position: 'absolute',
          left: -size * 1.6,
          top: -size * 1.6,
          width: size * 3.2,
          height: size * 3.2,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          opacity: (1 - pulse) * 0.8 * p,
          transform: `scale(${0.4 + pulse * 0.8})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          border: `4px solid ${color}`,
          boxShadow: `0 0 26px ${color}, inset 0 0 12px ${color}`,
          transform: `scale(${p})`,
        }}
      />
    </div>
  );
};

/** Price comparison card. The value is exactly what Steam's tooltip shows. */
export const PriceCard: React.FC<{
  label: string;
  date: string;
  price: number;
  color: string;
  x: number;
  y: number;
  w?: number;
  delay: number;
}> = ({label, date, price, color, x, y, w = 410, delay}) => {
  const p = useAppear(delay, 13);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        padding: '22px 30px 24px',
        borderRadius: 28,
        background: 'linear-gradient(160deg, rgba(14,30,69,0.95), rgba(6,14,36,0.95))',
        border: `2px solid ${color}`,
        boxShadow: `0 0 44px ${color}40, 0 24px 60px rgba(0,0,0,0.55)`,
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px) scale(${0.85 + p * 0.15})`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontFamily: 'TD Bold', fontSize: 34, color, letterSpacing: 2}}>{label}</span>
        <span style={{fontFamily: 'TD Body', fontSize: 26, color: COLORS.muted}}>{date}</span>
      </div>
      <div style={{fontFamily: 'TD Display', fontSize: 104, color: COLORS.white, lineHeight: 1.05, textShadow: glow(color)}}>
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

/** Animated percentage counter, e.g. −46%. */
export const PercentBadge: React.FC<{value: number; x: number; y: number; delay: number; size?: number; caption?: string}> = ({
  value,
  x,
  y,
  delay,
  size = 110,
  caption,
}) => {
  const frame = useCurrentFrame();
  const p = useAppear(delay, 11);
  const count = Math.round(interpolate(frame, [delay, delay + 20], [0, value], clamp));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: p,
        transform: `scale(${0.6 + p * 0.4}) rotate(${(1 - p) * -8}deg)`,
        transformOrigin: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: `${size * 0.1}px ${size * 0.3}px`,
          borderRadius: size * 0.3,
          background: `linear-gradient(135deg, ${COLORS.orange}, #FF6A2B)`,
          boxShadow: '0 0 60px rgba(255,146,62,0.6), 0 20px 50px rgba(0,0,0,0.5)',
          color: COLORS.white,
          fontFamily: 'TD Display',
          fontSize: size,
          lineHeight: 1.1,
        }}
      >
        <Arrow dir="down" color={COLORS.white} size={size * 0.62} />−{count}%
      </div>
      {caption && (
        <div style={{marginTop: 12, textAlign: 'center', fontFamily: 'TD Bold', fontSize: 30, color: COLORS.white, opacity: 0.9}}>
          {caption}
        </div>
      )}
    </div>
  );
};

/** A crop of a real case image taken from the Steam item page in the recording. */
export const CaseArt: React.FC<{
  name: string;
  crop: Rect;
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  rotate?: number;
  float?: number;
  glowColor?: string;
}> = ({name, crop, x, y, w, h, delay = 0, rotate = 0, float = 0, glowColor = COLORS.cyan}) => {
  const frame = useCurrentFrame();
  const p = useAppear(delay, 13);
  // Uniform scale: crop fills the box, proportions preserved.
  const s = Math.max(w / crop.w, h / crop.h);
  const offX = (w - crop.w * s) / 2 - crop.x * s;
  const offY = (h - crop.h * s) / 2 - crop.y * s;
  const bob = Math.sin((frame + delay * 3) / 22) * float;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bob,
        width: w,
        height: h,
        opacity: p,
        transform: `scale(${0.8 + p * 0.2}) rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -30,
          borderRadius: 40,
          background: `radial-gradient(ellipse at center, ${glowColor}38, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 26,
          overflow: 'hidden',
          border: '2px solid rgba(248,250,255,0.18)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        <Img
          src={staticFile(still(name))}
          style={{position: 'absolute', left: offX, top: offY, width: 1920 * s, height: 1080 * s}}
        />
      </div>
    </div>
  );
};

/** Scene envelope: soft zoom/blur in, quick fade out over the crossfade overlap. */
export const SceneWrap: React.FC<{children: React.ReactNode; fadeOut?: boolean}> = ({children, fadeOut = true}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inP = interpolate(frame, [0, 8], [0, 1], clamp);
  const outP = fadeOut ? interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: Math.min(inP, outP),
        transform: `scale(${interpolate(inP, [0, 1], [1.04, 1]) * interpolate(outP, [0, 1], [0.97, 1])})`,
        filter: inP < 1 ? `blur(${(1 - inP) * 10}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
