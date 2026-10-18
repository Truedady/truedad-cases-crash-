import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Viewport} from '../components/Viewport';
import {Arrow, CaseArt, Chip, Headline, Marker, PercentBadge, PriceCard, SceneWrap, useAppear} from '../components/ui';
import {
  ChartStory,
  DANGER_ZONE,
  DREAMS,
  dropPercent,
  FRACTURE,
  FRACTURE_ORDERS,
  LIVE,
  MONTAGE,
  Point,
  Rect,
} from '../footage';
import {COLORS} from '../theme';
import {at, sec} from '../timing';

const chartCenter = (c: Rect): Point => ({x: c.x + c.w / 2, y: c.y + c.h / 2});
const fitScale = (c: Rect, w: number) => w / c.w;
const peakFocus = (s: ChartStory) => ({x: s.peak.point.x + 50, y: s.peak.point.y + 45});
const nowFocus = (s: ChartStory) => ({x: s.now.point.x - 60, y: s.now.point.y + 50});

/** Floating label anchored to a chart point. */
const PointLabel: React.FC<{p: Point; text: string; color: string; delay: number; alignRight?: boolean; dy?: number}> = ({
  p,
  text,
  color,
  delay,
  alignRight,
  dy = -78,
}) => {
  const a = useAppear(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y + dy,
        transform: `translate(${alignRight ? '-100%' : '-50%'}, ${(1 - a) * 20}px)`,
        opacity: a,
        padding: '10px 22px',
        borderRadius: 999,
        background: 'rgba(8,19,47,0.9)',
        border: `2px solid ${color}`,
        boxShadow: `0 0 26px ${color}66`,
        color: COLORS.white,
        fontFamily: 'TD Bold',
        fontSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// ─── 1. HOOK ────────────────────────────────────────────────────────────────
export const HookScene: React.FC = () => {
  const dz = DANGER_ZONE;
  const L = LIVE.dangerZoneScrub;
  const srcToLocal = (srcFrame: number) => Math.round((srcFrame / 20 - L.from) * 30);
  const peakF = srcToLocal(dz.peak.frame);
  const nowF = srcToLocal(dz.now.frame);
  const c = chartCenter(dz.chart);
  const pf = peakFocus(dz);
  const nf = nowFocus(dz);
  return (
    <SceneWrap>
      <Headline
        y={215}
        stagger={4}
        lines={[
          {text: 'КЕЙСЫ CS2', size: 128},
          {text: 'ПАДАЮТ!', size: 158, color: COLORS.orange},
        ]}
      />
      <Viewport
        x={40}
        y={545}
        w={1000}
        h={640}
        tag="STEAM · DANGER ZONE CASE"
        layers={[
          {kind: 'still', name: dz.now.still},
          {kind: 'video', from: L.from, to: L.to},
        ]}
        cams={[
          {f: 0, x: pf.x + 40, y: pf.y, s: 2.2},
          {f: peakF + 14, x: pf.x, y: pf.y, s: 1.85},
          {f: nowF - 6, x: nf.x, y: nf.y, s: 1.85},
          {f: nowF + 8, x: nf.x, y: nf.y, s: 1.85},
          {f: 122, x: c.x, y: c.y + 20, s: fitScale(dz.chart, 1000) * 1.02},
        ]}
        overlay={(map) => (
          <>
            <Marker {...map(dz.peak.point)} color={COLORS.cyan} delay={peakF} />
            <Marker {...map(dz.now.point)} color={COLORS.orange} delay={nowF} />
          </>
        )}
      />
      <PercentBadge value={dropPercent(dz.peak.price, dz.now.price)} x={64} y={1225} delay={nowF - 4} size={104} />
      <div style={{position: 'absolute', left: 520, top: 1222}}>
        <Chip text="ПОЧТИ ПОЛОВИНА ЦЕНЫ" x={0} y={0} delay={nowF} color={COLORS.orange} size={32} />
        <Chip text={`$${dz.peak.price.toFixed(2)} → $${dz.now.price.toFixed(2)}`} x={0} y={78} delay={nowF + 6} size={40} />
      </div>
    </SceneWrap>
  );
};

// ─── 4/5. CASE STORY (Fracture, Dreams & Nightmares) ────────────────────────
type StoryTiming = {
  overview: number;
  peak: number;
  peakCard: number;
  pan: number;
  now: number;
  nowCard: number;
  badge: number;
  pull: number;
};

const CaseStory: React.FC<{story: ChartStory; title: string[]; titleSize: number; t: StoryTiming}> = ({
  story,
  title,
  titleSize,
  t,
}) => {
  const c = chartCenter(story.chart);
  const fit = fitScale(story.chart, 1000);
  const pf = peakFocus(story);
  const nf = nowFocus(story);
  const Z = 1.8;
  return (
    <SceneWrap>
      <CaseArt name={story.art.still} crop={story.art.crop} x={64} y={232} w={290} h={186} float={4} />
      <Headline
        x={392}
        y={238}
        width={640}
        align="left"
        delay={3}
        lines={title.map((text) => ({text, size: titleSize, font: 'TD Display'}))}
      />
      <Viewport
        x={40}
        y={452}
        w={1000}
        h={660}
        tag="STEAM · ЦЕНА ЗА ГОД"
        layers={[
          {kind: 'still', name: story.peak.still},
          {kind: 'still', name: story.now.still, fadeIn: [t.pan, t.pan + 10]},
        ]}
        cams={[
          {f: 0, x: c.x, y: c.y, s: fit * 1.25},
          {f: t.overview, x: c.x, y: c.y, s: fit},
          {f: t.peak, x: pf.x, y: pf.y, s: Z},
          {f: t.pan, x: pf.x, y: pf.y, s: Z},
          {f: t.now, x: nf.x, y: nf.y, s: Z},
          {f: t.pull - 1, x: nf.x, y: nf.y, s: Z},
          {f: t.pull + 20, x: c.x, y: c.y + 10, s: fit * 1.02},
        ]}
        overlay={(map) => (
          <>
            <Marker {...map(story.peak.point)} color={COLORS.cyan} delay={t.peak - 6} />
            <Marker {...map(story.now.point)} color={COLORS.orange} delay={t.now - 6} />
          </>
        )}
      />
      <PercentBadge
        value={dropPercent(story.peak.price, story.now.price)}
        x={600}
        y={478}
        delay={t.badge}
        size={92}
      />
      <PriceCard
        label={story.peak.label}
        date={story.peak.date}
        price={story.peak.price}
        color={COLORS.cyan}
        x={64}
        y={1140}
        delay={t.peakCard}
      />
      <PriceCard
        label={story.now.label}
        date={story.now.date}
        price={story.now.price}
        color={COLORS.orange}
        x={520}
        y={1140}
        delay={t.nowCard}
      />
    </SceneWrap>
  );
};

export const FractureScene: React.FC = () => {
  const a = (v: number) => at('fracture', v);
  return (
    <CaseStory
      story={FRACTURE}
      title={['FRACTURE', 'CASE']}
      titleSize={84}
      t={{
        overview: a(10.8),
        peak: a(11.5),
        peakCard: a(11.8),
        pan: a(12.95),
        now: a(13.8),
        nowCard: a(14.2),
        badge: a(14.75),
        pull: a(14.7),
      }}
    />
  );
};

export const DreamsScene: React.FC = () => {
  const a = (v: number) => at('dreams', v);
  return (
    <CaseStory
      story={DREAMS}
      title={['DREAMS &', 'NIGHTMARES']}
      titleSize={72}
      t={{
        overview: a(16.5),
        peak: a(17.4),
        peakCard: a(18.4),
        pan: a(19.75),
        now: a(20.5),
        nowCard: a(20.8),
        badge: a(21.35),
        pull: a(21.2),
      }}
    />
  );
};

// ─── 6. OTHER CASES ─────────────────────────────────────────────────────────
export const MarketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const H = 312;
  const GAP = 22;
  return (
    <SceneWrap>
      <Headline
        y={218}
        lines={[
          {text: 'ПОХОЖАЯ КАРТИНА', size: 84},
          {text: 'НА ДРУГИХ КЕЙСАХ', size: 84, color: COLORS.orange},
        ]}
      />
      {MONTAGE.map((m, i) => {
        const c = chartCenter(m.chart);
        const fit = fitScale(m.chart, 1000);
        const d = 4 + i * 9;
        const slide = interpolate(frame, [d, d + 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div
            key={m.name}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 1 - slide,
              transform: `translateX(${(i % 2 ? -1 : 1) * slide * 140}px)`,
            }}
          >
            <Viewport
              x={40}
              y={448 + i * (H + GAP)}
              w={1000}
              h={H}
              radius={28}
              layers={[{kind: 'still', name: m.still}]}
              cams={[
                {f: 0, x: c.x - 30, y: c.y + 12, s: fit * 1.0},
                {f: 100, x: c.x + 30, y: c.y + 12, s: fit * 1.08},
              ]}
            />
            <Chip
              text={m.name}
              x={64}
              y={448 + i * (H + GAP) + 18}
              delay={d + 4}
              color={COLORS.orange}
              size={30}
              icon={<Arrow dir="down" color={COLORS.orange} size={30} />}
            />
          </div>
        );
      })}
    </SceneWrap>
  );
};

// ─── 8. "MANY THINK…" ───────────────────────────────────────────────────────
export const ManyThinkScene: React.FC = () => {
  const a = (v: number) => at('manyThink', v);
  const dn = DREAMS;
  const c = chartCenter(dn.chart);
  const fit = fitScale(dn.chart, 1000);
  const quote = [
    {text: '«ОТЛИЧНО!', color: COLORS.orange, t: a(28.8)},
    {text: 'КУПЛЮ СЕЙЧАС,', color: COLORS.white, t: a(29.5)},
    {text: 'А ПОТОМ ПРОДАМ,', color: COLORS.white, t: a(30.4)},
    {text: 'КОГДА ЦЕНА ВЕРНЁТСЯ»', color: COLORS.cyan, t: a(31.2)},
  ];
  const cardIn = useAppear(a(28.6), 15);
  return (
    <SceneWrap>
      <Headline y={222} lines={[{text: 'МНОГИЕ ДУМАЮТ:', size: 92}]} />
      <Viewport
        x={40}
        y={372}
        w={1000}
        h={560}
        tag="STEAM · DREAMS & NIGHTMARES"
        layers={[
          {kind: 'still', name: dn.now.still},
          {kind: 'video', from: LIVE.dreamsScrub.from, to: LIVE.dreamsScrub.to},
        ]}
        cams={[
          {f: 0, x: c.x, y: c.y + 20, s: fit * 1.02},
          {f: 186, x: c.x + 20, y: c.y + 20, s: fit * 1.1},
        ]}
        overlay={(map) => (
          <>
            <Marker {...map(dn.peak.point)} color={COLORS.cyan} delay={a(31.2)} />
            <PointLabel p={map(dn.peak.point)} text="ЦЕНА ВЕРНЁТСЯ?" color={COLORS.cyan} delay={a(31.3)} dy={-82} />
            <Marker {...map(dn.now.point)} color={COLORS.orange} delay={a(29.5)} />
            <PointLabel p={map(dn.now.point)} text="КУПЛЮ СЕЙЧАС" color={COLORS.orange} delay={a(29.6)} alignRight dy={-90} />
          </>
        )}
      />
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 968,
          width: 920,
          height: 450,
          borderRadius: 34,
          background: 'linear-gradient(160deg, rgba(14,30,69,0.92), rgba(6,14,36,0.95))',
          border: '2px solid rgba(67,197,245,0.35)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 60}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 34,
            top: -40,
            fontFamily: 'TD Display',
            fontSize: 220,
            color: COLORS.cyan,
            opacity: 0.25,
            lineHeight: 1,
          }}
        >
          “
        </div>
      </div>
      {quote.map((q, i) => (
        <QuoteLine key={i} text={q.text} color={q.color} delay={q.t} y={1012 + i * 96} />
      ))}
    </SceneWrap>
  );
};

const QuoteLine: React.FC<{text: string; color: string; delay: number; y: number}> = ({text, color, delay, y}) => {
  const p = useAppear(delay, 15);
  return (
    <div
      style={{
        position: 'absolute',
        left: 92,
        top: y,
        fontFamily: 'TD Display',
        fontSize: 64,
        color,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        textShadow: '0 6px 24px rgba(0,0,0,0.6)',
      }}
    >
      {text}
    </div>
  );
};

// ─── 10. WHERE IS THE BOTTOM ────────────────────────────────────────────────
export const BottomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fr = FRACTURE;
  const c = chartCenter(fr.chart);
  const fit = fitScale(fr.chart, 1000);
  const q = useAppear(10, 9);
  return (
    <SceneWrap>
      <Headline
        y={210}
        stagger={6}
        lines={[
          {text: 'ГДЕ', size: 150},
          {text: 'ДНО?', size: 190, color: COLORS.orange},
        ]}
      />
      <Viewport
        x={40}
        y={600}
        w={1000}
        h={700}
        tag="STEAM · FRACTURE CASE"
        layers={[{kind: 'still', name: fr.now.still}]}
        cams={[
          {f: 0, x: c.x, y: c.y, s: fit * 1.02},
          {f: 95, x: 1280, y: 720, s: 1.5},
        ]}
        overlay={(map) => {
          const p = map(fr.now.point);
          return (
            <>
              <Marker {...p} color={COLORS.orange} delay={4} size={34} />
              <div
                style={{
                  position: 'absolute',
                  left: p.x - 330,
                  top: p.y - 420 + Math.sin(frame / 9) * 6,
                  fontFamily: 'TD Display',
                  fontSize: 330,
                  lineHeight: 1,
                  color: COLORS.orange,
                  opacity: q * 0.92,
                  transform: `scale(${0.5 + q * 0.5}) rotate(${(1 - q) * 20}deg)`,
                  textShadow: '0 0 60px rgba(255,146,62,0.8), 0 10px 40px rgba(0,0,0,0.6)',
                }}
              >
                ?
              </div>
            </>
          );
        }}
      />
    </SceneWrap>
  );
};

// ─── 11. SUPPLY & DEMAND (real order book) ──────────────────────────────────
export const SupplyScene: React.FC = () => {
  const a = (v: number) => at('supply', v);
  const o = FRACTURE_ORDERS;
  const sale = {x: o.forSale.x + o.forSale.w / 2, y: 278};
  const buy = {x: o.buyRequests.x + o.buyRequests.w / 2, y: 278};
  const Z = 1.85;
  return (
    <SceneWrap>
      <Headline y={218} lines={[{text: 'ОГРОМНЫЕ ЗАПАСЫ', size: 86}]} />
      <Headline y={318} delay={a(39.3)} lines={[{text: 'СПРОС МЕНЯЕТСЯ', size: 86, color: COLORS.orange}]} />
      <Viewport
        x={40}
        y={470}
        w={1000}
        h={700}
        tag="STEAM · FRACTURE CASE"
        layers={[{kind: 'still', name: o.still}]}
        cams={[
          {f: 0, x: sale.x - 20, y: sale.y, s: Z * 1.12},
          {f: a(37.8), x: sale.x, y: sale.y, s: Z},
          {f: a(39.25), x: sale.x, y: sale.y, s: Z},
          {f: a(39.9), x: buy.x, y: buy.y, s: Z},
          {f: a(40.7), x: buy.x, y: buy.y, s: Z},
          {f: a(41.5), x: 955, y: 300, s: 1.0},
        ]}
        overlay={(map) => (
          <>
            <Highlight r={o.forSale} map={map} color={COLORS.orange} delay={a(37.6)} />
            <Highlight r={o.buyRequests} map={map} color={COLORS.cyan} delay={a(39.8)} />
          </>
        )}
      />
      <Chip text="ПРЕДЛОЖЕНИЕ: ЛОТЫ НА ПРОДАЖУ" x={64} y={1205} delay={a(37.7)} color={COLORS.orange} size={34} />
      <Chip text="СПРОС: ЗАЯВКИ НА ПОКУПКУ" x={64} y={1295} delay={a(39.8)} color={COLORS.cyan} size={34} />
    </SceneWrap>
  );
};

const Highlight: React.FC<{r: Rect; map: (p: Point) => Point; color: string; delay: number}> = ({r, map, color, delay}) => {
  const p = useAppear(delay, 12);
  const a = map({x: r.x, y: r.y});
  const b = map({x: r.x + r.w, y: r.y + r.h});
  const pad = 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: a.x - pad,
        top: a.y - pad,
        width: b.x - a.x + pad * 2,
        height: b.y - a.y + pad * 2,
        borderRadius: 14,
        border: `4px solid ${color}`,
        boxShadow: `0 0 30px ${color}, inset 0 0 18px ${color}55`,
        opacity: p,
        transform: `scale(${1.15 - p * 0.15})`,
      }}
    />
  );
};

// ─── 14. WHAT HAS TO HAPPEN ─────────────────────────────────────────────────
export const WhatNeededScene: React.FC = () => {
  const dz = DANGER_ZONE;
  const c = chartCenter(dz.chart);
  const fit = fitScale(dz.chart, 1000);
  return (
    <SceneWrap>
      <Headline
        y={212}
        stagger={4}
        lines={[
          {text: 'ЧТО ДОЛЖНО', size: 86},
          {text: 'ПРОИЗОЙТИ,', size: 86},
          {text: 'ЧТОБЫ ОНИ СНОВА', size: 86},
          {text: 'НАЧАЛИ РАСТИ?', size: 92, color: COLORS.orange},
        ]}
      />
      <Viewport
        x={40}
        y={630}
        w={1000}
        h={680}
        tag="STEAM · DANGER ZONE CASE"
        layers={[{kind: 'still', name: dz.now.still}]}
        cams={[
          {f: 0, x: c.x, y: c.y + 20, s: fit * 1.02},
          {f: 110, x: 1300, y: 540, s: 1.45},
        ]}
        overlay={(map) => <Marker {...map(dz.now.point)} color={COLORS.cyan} delay={sec(0.5)} size={34} />}
      />
    </SceneWrap>
  );
};
