import { readdir, stat } from 'node:fs/promises'
import sharp from 'sharp'

let originalBytes = 0
let optimizedBytes = 0
let count = 0

async function optimize(input, output, options) {
  const original = await stat(input)
  const image = sharp(input)
  const result = options.resize
    ? await image.resize(options.resize).webp(options.webp).toFile(output)
    : await image.webp(options.webp).toFile(output)

  if (result.size >= original.size) throw new Error(`${output} is not smaller than its source`)
  originalBytes += original.size
  optimizedBytes += result.size
  count++
}

const iconOptions = {
  resize: { width: 448, height: 448, fit: 'inside', withoutEnlargement: true },
  webp: { quality: 82, alphaQuality: 95, effort: 6, smartSubsample: true },
}

for (const group of ['food', 'drinks']) {
  const files = (await readdir(`artwork/source/${group}`)).filter(file => file.endsWith('.png'))
  for (const file of files) {
    await optimize(
      `artwork/source/${group}/${file}`,
      `public/assets/${group}/${file.replace(/\.png$/, '.webp')}`,
      iconOptions,
    )
  }
}

await optimize('artwork/source/restaurant-bg.png', 'public/assets/restaurant-bg.webp', {
  webp: { quality: 78, effort: 6, smartSubsample: true },
})
await optimize('artwork/source/waiter.png', 'public/assets/waiter.webp', {
  resize: { width: 384, withoutEnlargement: true },
  webp: { quality: 82, alphaQuality: 95, effort: 6, smartSubsample: true },
})

const percent = Math.round((1 - optimizedBytes / originalBytes) * 100)
console.log(`Optimized ${count} images: ${(originalBytes / 1e6).toFixed(1)} MB → ${(optimizedBytes / 1e6).toFixed(1)} MB (${percent}% smaller).`)
