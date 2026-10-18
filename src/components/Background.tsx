import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

const PARTICLES = Array.from({length: 46}, (_, i) => ({
  x: random(`px${i}`) * 1080,
  y: random(`py${i}`) * 1920,
  r: 1.5 + random(`pr${i}`) * 3.5,
  speed: 0.25 + random(`ps${i}`) * 0.9,
  phase: random(`ph${i}`) * Math.PI * 2,
  warm: random(`pw${i}`) > 0.72,
}));

/** Persistent cinematic backdrop: navy gradient, drifting glows, faint grid and particles. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const g1x = 22 + Math.sin(t * 0.35) * 8;
  const g1y = 18 + Math.cos(t * 0.27) * 6;
  const g2x = 82 + Math.cos(t * 0.31) * 7;
  const g2y = 78 + Math.sin(t * 0.22) * 6;

  return (
    <AbsoluteFill style={{background: COLORS.navyDeep, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at ${g1x}% ${g1y}%, rgba(67,197,245,0.22), transparent 70%),
            radial-gradient(ellipse 65% 40% at ${g2x}% ${g2y}%, rgba(255,146,62,0.16), transparent 70%),
            linear-gradient(180deg, ${COLORS.navy} 0%, #0A1838 45%, ${COLORS.navyDeep} 100%)`,
        }}
      />
      {/* Perspective grid on the floor */}
      <AbsoluteFill style={{perspective: 900, perspectiveOrigin: '50% 30%', opacity: 0.35}}>
        <div
          style={{
            position: 'absolute',
            left: -600,
            right: -600,
            top: 1150,
            height: 1400,
            transform: 'rotateX(68deg)',
            transformOrigin: '50% 0%',
            backgroundImage: `linear-gradient(rgba(67,197,245,0.35) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(67,197,245,0.35) 1.5px, transparent 1.5px)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${(frame * 1.2) % 90}px`,
            maskImage: 'linear-gradient(180deg, transparent 0%, black 35%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 35%, black 60%, transparent 100%)',
          }}
        />
      </AbsoluteFill>
      {PARTICLES.map((p, i) => {
        const y = (((p.y - frame * p.speed) % 1920) + 1920) % 1920;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.3 + p.phase));
        const c = p.warm ? COLORS.orange : COLORS.cyan;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + Math.sin(t * 0.6 + p.phase) * 14,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: c,
              opacity: tw * 0.55,
              boxShadow: `0 0 ${p.r * 5}px ${c}`,
            }}
          />
        );
      })}
      {/* Vignette */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(2,6,18,0.75) 100%)'}}
      />
    </AbsoluteFill>
  );
};
