import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {loadFonts} from './fonts';
import {
  BottomScene,
  DreamsScene,
  FractureScene,
  HookScene,
  ManyThinkScene,
  MarketScene,
  SupplyScene,
  WhatNeededScene,
} from './scenes/ChartScenes';
import {
  FinalScene,
  InterestingScene,
  NoGuaranteeScene,
  NotHowMuchScene,
  ProblemScene,
  QuestionScene,
  SeeYourselfScene,
} from './scenes/TextScenes';
import {DURATION_FRAMES, OVERLAP, SceneKey, SCENES, sec} from './timing';

loadFonts();

const TIMELINE: [SceneKey, React.FC][] = [
  ['hook', HookScene],
  ['question', QuestionScene],
  ['seeYourself', SeeYourselfScene],
  ['fracture', FractureScene],
  ['dreams', DreamsScene],
  ['market', MarketScene],
  ['interesting', InterestingScene],
  ['manyThink', ManyThinkScene],
  ['problem', ProblemScene],
  ['bottom', BottomScene],
  ['supply', SupplyScene],
  ['noGuarantee', NoGuaranteeScene],
  ['notHowMuch', NotHowMuchScene],
  ['whatNeeded', WhatNeededScene],
  ['final', FinalScene],
];

export const TrueDadCasesShorts: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#040A1C'}}>
    <Background />
    {TIMELINE.map(([key, Scene]) => {
      const from = sec(SCENES[key][0]);
      const end = Math.min(sec(SCENES[key][1]) + OVERLAP, DURATION_FRAMES);
      return (
        <Sequence key={key} name={key} from={from} durationInFrames={end - from}>
          <Scene />
        </Sequence>
      );
    })}
    {/* Master timeline: the supplied narration, untouched. */}
    <Audio src={staticFile('cases_voiceover.mp3')} />
  </AbsoluteFill>
);
