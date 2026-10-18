// Renders preview stills from one bundle: node scripts/stills.mjs OUT_DIR frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'TrueDadCasesShorts', browserExecutable});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: path.join(outDir, `f${f}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, browserExecutable});
  console.log('rendered', f);
}
