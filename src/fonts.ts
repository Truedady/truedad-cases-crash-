import {continueRender, delayRender, staticFile} from 'remotion';

// Inter (full Cyrillic coverage), bundled in public/fonts so renders are deterministic.
const FACES = [
  {family: 'TD Display', file: 'fonts/InterDisplay-Black.otf', weight: '900'},
  {family: 'TD Bold', file: 'fonts/InterDisplay-ExtraBold.otf', weight: '800'},
  {family: 'TD Body', file: 'fonts/Inter-SemiBold.otf', weight: '600'},
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    FACES.map(async ({family, file, weight}) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, {weight});
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
