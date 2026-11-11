import { readdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const columns = 4
const rows = 8
const cellSize = 192
const artSize = 180

const entries = []
for (const kind of ['food', 'drinks']) {
  const files = (await readdir(`public/assets/${kind}`)).filter(file => file.endsWith('.webp')).sort()
  for (const file of files) entries.push({ kind: kind === 'drinks' ? 'drink' : kind, id: file.replace(/\.webp$/, ''), file: `public/assets/${kind}/${file}` })
}

if (entries.length !== 31) throw new Error(`Expected 31 order illustrations, found ${entries.length}`)

const positions = {}
const layers = []
for (const [index, entry] of entries.entries()) {
  const column = index % columns
  const row = Math.floor(index / columns)
  const { data, info } = await sharp(entry.file)
    .resize({ width: artSize, height: artSize, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  layers.push({
    input: data,
    left: column * cellSize + Math.floor((cellSize - info.width) / 2),
    top: row * cellSize + Math.floor((cellSize - info.height) / 2),
  })
  positions[`${entry.kind}:${entry.id}`] = [column, row]
}

const output = 'public/assets/order-atlas.webp'
const result = await sharp({
  create: {
    width: columns * cellSize,
    height: rows * cellSize,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(layers)
  .webp({ quality: 70, alphaQuality: 85, effort: 6, smartSubsample: true })
  .toFile(output)

await writeFile('src/data/orderAtlas.json', JSON.stringify({ columns, rows, positions }, null, 2) + '\n')
console.log(`Built ${entries.length}-item order atlas: ${(result.size / 1e3).toFixed(0)} KB.`)
