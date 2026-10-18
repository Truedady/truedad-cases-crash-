import React from 'react';
import {Composition} from 'remotion';
import {TrueDadCasesShorts} from './TrueDadCasesShorts';
import {VIDEO} from './theme';
import {DURATION_FRAMES} from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TrueDadCasesShorts"
    component={TrueDadCasesShorts}
    durationInFrames={DURATION_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
