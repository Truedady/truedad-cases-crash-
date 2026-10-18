import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Viewport} from '../components/Viewport';
import {Arrow, CaseArt, Chip, Headline, SceneWrap, useAppear} from '../components/ui';
import {CASE_ART, DANGER_ZONE, DREAMS, dropPercent, FRACTURE, MARKET_LIST} from '../footage';
import {COLORS} from '../theme';
import {at} from '../timing';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ListViewport: React.FC<{y: number; h: number; from: number; to: number; frames: number; dim?: number}> = ({
  y,
  h,
  from,
  to,
  frames,
  dim,
}) => {
  const a = MARKET_LIST.area;
  return (
    <Viewport
      x={40}
      y={y}
      w={1000}
      h={h}
      tag="STEAM · КЕЙСЫ CS2"
      dim={dim}
      layers={[{kind: 'still', name: MARKET_LIST.still}]}
      cams={[
        {f: 0, x: a.x + a.w / 2, y: from, s: 1.1},
        {f: frames, x: a.x + a.w / 2, y: to, s: 1.16},
      ]}
    />
  );
};

/** Big versus row: arrow + word + subline. */
const VersusRow: React.FC<{
  dir: 'up' | 'down';
  color: string;
  word: string;
  sub: string;
  y: number;
  delay: number;
}> = ({dir, color, word, sub, y, delay}) => {
  const p = useAppear(delay, 13);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: y,
        width: 1000,
        height: 230,
        borderRadius: 34,
        background: `linear-gradient(100deg, ${color}2E, rgba(8,19,47,0.85) 65%)`,
        border: `2px solid ${color}AA`,
        boxShadow: `0 0 50px ${color}40`,
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '0 40px',
        opacity: p,
        transform: `translateX(${(1 - p) * (dir === 'up' ? -120 : 120)}px)`,
      }}
    >
      <Arrow dir={dir} color={color} size={130} />
      <div>
        <div style={{fontFamily: 'TD Display', fontSize: 108, color, lineHeight: 1, textShadow: `0 0 36px ${color}88`}}>
          {word}
        </div>
        <div style={{fontFamily: 'TD Bold', fontSize: 52, color: COLORS.white, marginTop: 8}}>{sub}</div>
      </div>
    </div>
  );
};

// ─── 2. MAIN QUESTION ───────────────────────────────────────────────────────
export const QuestionScene: React.FC = () => {
  const a = (v: number) => at('question', v);
  const ili = useAppear(a(6.9));
  return (
    <SceneWrap>
      <Headline y={220} lines={[{text: 'ГЛАВНЫЙ ВОПРОС', size: 88}]} />
      <VersusRow dir="up" color={COLORS.cyan} word="ШАНС" sub="ЗАРАБОТАТЬ?" y={360} delay={a(5.8)} />
      <div
        style={{
          position: 'absolute',
          top: 602,
          width: 1080,
          textAlign: 'center',
          fontFamily: 'TD Display',
          fontSize: 56,
          color: COLORS.white,
          opacity: ili,
          transform: `scale(${0.6 + ili * 0.4})`,
        }}
      >
        ИЛИ
      </div>
      <VersusRow dir="down" color={COLORS.orange} word="ЛОВУШКА" sub="ДЛЯ ИНВЕСТОРОВ?" y={680} delay={a(7.2)} />
      <ListViewport y={945} h={500} from={330} to={760} frames={150} />
    </SceneWrap>
  );
};

// ─── 3. "SEE FOR YOURSELF" ──────────────────────────────────────────────────
export const SeeYourselfScene: React.FC = () => {
  const frame = useCurrentFrame();
  const art = FRACTURE.art.crop;
  const cx = art.x + art.w / 2;
  const cy = art.y + art.h / 2;
  const sweep = interpolate(frame, [8, 24], [0, 1], clamp);
  return (
    <SceneWrap>
      <Viewport
        x={0}
        y={0}
        w={1080}
        h={1920}
        frameStyle="bleed"
        dim={0.5}
        layers={[{kind: 'still', name: FRACTURE.art.still}]}
        cams={[
          {f: 0, x: cx + 40, y: cy, s: 2.4},
          {f: 42, x: cx, y: cy, s: 2.9},
        ]}
      />
      <Headline
        y={760}
        stagger={4}
        lines={[
          {text: 'СМОТРИ', size: 150},
          {text: 'САМ', size: 150, color: COLORS.cyan},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 540 - 260,
          top: 1105,
          width: 520 * sweep,
          height: 10,
          borderRadius: 5,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.orange})`,
          boxShadow: `0 0 24px ${COLORS.cyan}`,
        }}
      />
    </SceneWrap>
  );
};

// ─── 7. "BUT HERE'S WHAT'S INTERESTING" ─────────────────────────────────────
export const InterestingScene: React.FC = () => {
  return (
    <SceneWrap>
      <CaseArt name={DREAMS.art.still} crop={DREAMS.art.crop} x={520} y={300} w={460} h={290} rotate={5} float={10} glowColor={COLORS.orange} />
      <CaseArt name={FRACTURE.art.still} crop={FRACTURE.art.crop} x={90} y={1130} w={460} h={300} rotate={-6} float={10} delay={4} />
      <Headline
        y={720}
        stagger={5}
        lines={[
          {text: 'НО ВОТ ЧТО', size: 112},
          {text: 'ИНТЕРЕСНО', size: 140, color: COLORS.orange},
        ]}
      />
    </SceneWrap>
  );
};

// ─── 9. "ONE PROBLEM" ───────────────────────────────────────────────────────
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useAppear(2, 8);
  const shake = frame < 20 ? Math.sin(frame * 2.2) * (20 - frame) * 0.6 : 0;
  return (
    <SceneWrap>
      <Viewport
        x={40}
        y={1040}
        w={1000}
        h={420}
        dim={0.45}
        blur={2}
        tag="STEAM · DREAMS & NIGHTMARES"
        layers={[{kind: 'still', name: DREAMS.now.still}]}
        cams={[
          {f: 0, x: 1250, y: 620, s: 1.3},
          {f: 50, x: 1300, y: 625, s: 1.45},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 540 - 120,
          top: 300,
          transform: `translateX(${shake}px) scale(${p})`,
          filter: `drop-shadow(0 0 40px ${COLORS.orange})`,
        }}
      >
        <svg width={240} height={220} viewBox="0 0 240 220">
          <path d="M120 10 L232 208 H8 Z" fill="none" stroke={COLORS.orange} strokeWidth={16} strokeLinejoin="round" />
          <rect x={110} y={70} width={20} height={78} rx={10} fill={COLORS.orange} />
          <circle cx={120} cy={178} r={13} fill={COLORS.orange} />
        </svg>
      </div>
      <Headline
        y={600}
        delay={3}
        lines={[
          {text: 'НО ЕСТЬ', size: 110},
          {text: 'ОДНА', size: 140, color: COLORS.orange},
          {text: 'ПРОБЛЕМА', size: 140, color: COLORS.orange},
        ]}
      />
    </SceneWrap>
  );
};

// ─── 12. NO GUARANTEE ───────────────────────────────────────────────────────
export const NoGuaranteeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = (v: number) => at('noGuarantee', v);
  const neq = useAppear(a(43.9), 9);
  const strike = interpolate(frame, [a(45.9), a(46.4)], [0, 1], clamp);
  return (
    <SceneWrap>
      <Chip
        text="КЕЙС ПЕРЕСТАЛ ВЫПАДАТЬ"
        x={64}
        y={240}
        delay={a(42.0)}
        color={COLORS.cyan}
        size={50}
        icon={
          <svg width={54} height={54} viewBox="0 0 54 54">
            <rect x={6} y={14} width={42} height={30} rx={5} fill="none" stroke={COLORS.cyan} strokeWidth={5} />
            <line x1={6} y1={50} x2={48} y2={6} stroke={COLORS.orange} strokeWidth={6} strokeLinecap="round" />
          </svg>
        }
      />
      <div
        style={{
          position: 'absolute',
          top: 350,
          width: 1080,
          textAlign: 'center',
          fontFamily: 'TD Display',
          fontSize: 230,
          lineHeight: 1,
          color: COLORS.orange,
          opacity: neq,
          transform: `scale(${0.4 + neq * 0.6})`,
          textShadow: '0 0 60px rgba(255,146,62,0.7)',
        }}
      >
        ≠
      </div>
      <Headline
        y={610}
        delay={a(44.3)}
        lines={[
          {text: 'ЗАВТРА', size: 104},
          {text: 'ПОДОРОЖАЕТ', size: 104, color: COLORS.cyan},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 770,
          width: 860 * strike,
          height: 16,
          borderRadius: 8,
          background: COLORS.orange,
          transform: 'rotate(-3deg)',
          transformOrigin: 'left center',
          boxShadow: `0 0 26px ${COLORS.orange}`,
        }}
      />
      <ListViewport y={900} h={560} from={250} to={820} frames={175} />
    </SceneWrap>
  );
};

// ─── 13. "NOT HOW MUCH THEY FELL" ───────────────────────────────────────────
const DROPS = [
  {story: FRACTURE, label: 'FRACTURE'},
  {story: DREAMS, label: 'DREAMS & NIGHTMARES'},
  {story: DANGER_ZONE, label: 'DANGER ZONE'},
];

export const NotHowMuchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = (v: number) => at('notHowMuch', v);
  const fade = interpolate(frame, [a(49.4), a(50.2)], [0, 1], clamp);
  return (
    <SceneWrap>
      <Headline
        y={218}
        lines={[
          {text: 'ИНТЕРЕСНЕЕ НЕ ТО,', size: 80},
          {text: 'НАСКОЛЬКО УПАЛИ', size: 80, color: COLORS.orange},
        ]}
      />
      {DROPS.map((d, i) => (
        <DropRow key={d.label} {...d} y={470 + i * 300} delay={8 + i * 7} fade={fade} />
      ))}
    </SceneWrap>
  );
};

const DropRow: React.FC<{story: typeof FRACTURE; label: string; y: number; delay: number; fade: number}> = ({
  story,
  label,
  y,
  delay,
  fade,
}) => {
  const p = useAppear(delay, 14);
  const pct = dropPercent(story.peak.price, story.now.price);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: y,
          width: 920,
          height: 260,
          borderRadius: 30,
          background: 'linear-gradient(160deg, rgba(14,30,69,0.92), rgba(6,14,36,0.95))',
          border: '2px solid rgba(67,197,245,0.3)',
          opacity: 1 - fade * 0.35,
        }}
      />
      <CaseArt name={story.art.still} crop={story.art.crop} x={66} y={y + 26} w={300} h={208} delay={delay} />
      <div style={{position: 'absolute', left: 400, top: y + 40, opacity: 1 - fade * 0.5}}>
        <div style={{fontFamily: 'TD Bold', fontSize: 34, color: COLORS.muted, whiteSpace: 'nowrap'}}>{label}</div>
        <div style={{fontFamily: 'TD Bold', fontSize: 46, color: COLORS.white, marginTop: 6, whiteSpace: 'nowrap'}}>
          ${story.peak.price.toFixed(2)} → ${story.now.price.toFixed(2)}
        </div>
        <div
          style={{
            fontFamily: 'TD Display',
            fontSize: 84,
            color: COLORS.orange,
            lineHeight: 1.1,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          −{pct}%
          <div
            style={{
              position: 'absolute',
              left: -8,
              top: '52%',
              height: 9,
              width: `${(fade * 100 + 6) * (fade > 0 ? 1 : 0)}%`,
              background: COLORS.white,
              borderRadius: 5,
              boxShadow: '0 0 16px rgba(248,250,255,0.8)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── 15. FINAL QUESTION ─────────────────────────────────────────────────────
export const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = (v: number) => at('final', v);
  const cta = useAppear(a(57.0), 12);
  const ili = useAppear(a(56.5));
  const pulse = 1 + Math.sin(frame / 6) * 0.025 * cta;
  return (
    <SceneWrap fadeOut={false}>
      <div style={{position: 'absolute', left: 64, top: 222, display: 'flex', alignItems: 'center', gap: 22}}>
        <FinalWord word="ПОКУПАТЬ" color={COLORS.cyan} dir="up" delay={a(55.3)} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 372,
          width: 1080,
          textAlign: 'center',
          fontFamily: 'TD Display',
          fontSize: 60,
          color: COLORS.white,
          opacity: ili,
          transform: `scale(${0.6 + ili * 0.4})`,
        }}
      >
        ИЛИ
      </div>
      <div style={{position: 'absolute', left: 64, top: 460, display: 'flex', alignItems: 'center', gap: 22}}>
        <FinalWord word="ЖДАТЬ?" color={COLORS.orange} dir="down" delay={a(56.8)} />
      </div>
      {CASE_ART.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <CaseArt
            key={c.name}
            name={c.still}
            crop={c.crop}
            x={52 + col * 330}
            y={680 + row * 262}
            w={300}
            h={226}
            delay={4 + i * 3}
            float={5}
            glowColor={i % 2 ? COLORS.orange : COLORS.cyan}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 1250,
          width: 880,
          height: 150,
          borderRadius: 75,
          background: `linear-gradient(100deg, ${COLORS.cyan}, #2A8FD8)`,
          boxShadow: `0 0 60px ${COLORS.cyan}88, 0 24px 60px rgba(0,0,0,0.5)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 60}px) scale(${pulse})`,
        }}
      >
        <svg width={70} height={64} viewBox="0 0 70 64">
          <path d="M8 6 H62 a6 6 0 0 1 6 6 V40 a6 6 0 0 1 -6 6 H30 L14 60 V46 H8 a6 6 0 0 1 -6 -6 V12 a6 6 0 0 1 6 -6 Z" fill={COLORS.navy} />
        </svg>
        <span style={{fontFamily: 'TD Display', fontSize: 54, color: COLORS.navy}}>ПИШИ В КОММЕНТАРИЯХ</span>
      </div>
    </SceneWrap>
  );
};

const FinalWord: React.FC<{word: string; color: string; dir: 'up' | 'down'; delay: number}> = ({word, color, dir, delay}) => {
  const p = useAppear(delay, 13);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: p,
        transform: `translateX(${(1 - p) * (dir === 'up' ? -100 : 100)}px)`,
      }}
    >
      <Arrow dir={dir} color={color} size={130} />
      <span style={{fontFamily: 'TD Display', fontSize: 132, color, lineHeight: 1, textShadow: `0 0 40px ${color}99`}}>{word}</span>
    </div>
  );
};
