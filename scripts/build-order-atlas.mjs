import { readdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const columns = 4
const cellSize = 192
const artSize = 180

async function buildAtlas(entries, output) {
  const rows = Math.ceil(entries.length / columns)
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

  console.log(`${output}: ${entries.length} illustrations, ${(result.size / 1e3).toFixed(0)} KB.`)
  return { columns, rows, positions }
}

const classicEntries = []
for (const group of ['food', 'drinks']) {
  const files = (await readdir(`public/assets/${group}`)).filter(file => file.endsWith('.webp')).sort()
  for (const file of files) {
    classicEntries.push({
      kind: group === 'drinks' ? 'drink' : 'food',
      id: file.replace(/\.webp$/, ''),
      file: `public/assets/${group}/${file}`,
    })
  }
}
if (classicEntries.length !== 36) throw new Error(`Expected 36 classic and Halloween illustrations, found ${classicEntries.length}`)
const classicAtlas = await buildAtlas(classicEntries, 'public/assets/order-atlas.webp')
await writeFile('src/data/orderAtlas.json', JSON.stringify(classicAtlas, null, 2) + '\n')

const sectionAtlases = {}
for (const [key, folder, expected] of [
  ['thanksgiving', 'thanksgiving', 9],
  ['fantasticBeasts', 'fantastic-beasts', 9],
  ['chineseNewYear', 'chinese-new-year', 15],
]) {
  const files = (await readdir(`public/assets/sections/${folder}`)).filter(file => file.endsWith('.webp')).sort()
  if (files.length !== expected) throw new Error(`Expected ${expected} ${folder} illustrations, found ${files.length}`)
  const entries = files.map(file => ({
    kind: 'food',
    id: file.replace(/\.webp$/, ''),
    file: `public/assets/sections/${folder}/${file}`,
  }))
  sectionAtlases[key] = await buildAtlas(entries, `public/assets/sections/${folder}-atlas.webp`)
}
await writeFile('src/data/sectionAtlases.json', JSON.stringify(sectionAtlases, null, 2) + '\n')
