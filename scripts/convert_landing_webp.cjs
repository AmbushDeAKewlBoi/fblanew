/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, '..', 'landingassets');
const OUT = path.resolve(__dirname, '..', 'public', 'landingassets');

const targets = [
  { suffix: 'xl', width: 2200, quality: 78 },
  { suffix: 'lg', width: 1600, quality: 76 },
  { suffix: 'md', width: 1100, quality: 74 },
  { suffix: 'sm', width: 720, quality: 72 },
];

const aliases = {
  '129A6CB7-9AD9-4B83-A74D-79E782F848812026-04-11_20-15-55_100': 'make-your-mark-podium',
  '217691D0-0871-4E9A-B953-E97821AD881C2026-04-11_21-18-39_600': 'team-trophy-quartet',
  'C1CFF1C4-0347-4297-9C5E-03FC406E70AE2026-04-11_22-30-14_100': 'mis-pennant-trio',
  'C51C75B0-A836-4D1C-A983-F79414D2B9C32026-04-11_20-08-01_000': 'stage-introduction',
  'F3D0CB2A-4CD3-4BDE-B9A8-2F1344B426E72026-04-11_22-17-07_100': 'speaker-projection',
};

async function run() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g)$/i.test(f));
  if (!files.length) {
    console.log('No JPEGs found in', SRC);
    return;
  }

  for (const file of files) {
    const baseRaw = file.replace(/\.(jpe?g)$/i, '');
    const slug = aliases[baseRaw] || baseRaw.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const inputPath = path.join(SRC, file);

    const meta = await sharp(inputPath).rotate().metadata();
    console.log(`[${slug}] source ${meta.width}x${meta.height}`);

    for (const t of targets) {
      if (meta.width && t.width >= meta.width && t.suffix !== 'sm') continue;
      const outName = `${slug}-${t.suffix}.webp`;
      const outPath = path.join(OUT, outName);
      await sharp(inputPath)
        .rotate()
        .resize({ width: t.width, withoutEnlargement: true })
        .webp({ quality: t.quality, effort: 5 })
        .toFile(outPath);
      const stat = fs.statSync(outPath);
      console.log(`  -> ${outName} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }

  console.log('\nDone. Output:', OUT);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
