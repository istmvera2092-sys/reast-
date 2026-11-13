import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { build } from 'esbuild'

async function loadTypeScript(entryPoint) {
  const result = await build({ entryPoints: [entryPoint], bundle: true, platform: 'node', format: 'esm', write: false, define: { 'import.meta.env.BASE_URL': "'/'" } })
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].contents).toString('base64')}`)
}

const { FOOD, FOOD_1, FOOD_2, DRINKS, DEFAULT_SECTIONS, HALLOWEEN_FOOD, HALLOWEEN_DRINKS, THANKSGIVING_FOOD, FANTASTIC_BEASTS_FOOD, CHINESE_NEW_YEAR_FOOD } = await loadTypeScript('src/data/menu.ts')
const { generateOrder, menuForSections } = await loadTypeScript('src/utils/generateOrder.ts')

assert.deepEqual(FOOD.map(item => item.name), [
  'apples', 'bananas', 'cheese', 'doughnuts', 'eggs', 'fish', 'grapes', 'hot dogs',
  'ice-cream', 'ketchup', 'lettuce', 'mayonnaise', 'noodles', 'olives', 'pizza',
  'quiche', 'rice', 'salad', 'toast', 'vegetables', 'waffles', 'yoghurt', 'zucchini',
])
assert.deepEqual(DRINKS.map(item => item.name), [
  'orange juice', 'milk', 'lemonade', 'cola', 'water', 'hot chocolate', 'tea', 'milkshake',
])
assert.deepEqual(FOOD_1.map(item => item.name), [
  'apples', 'bananas', 'cheese', 'doughnuts', 'eggs', 'fish', 'grapes', 'hot dogs',
  'ice-cream', 'ketchup', 'lettuce',
])
assert.deepEqual(FOOD_2.map(item => item.name), [
  'mayonnaise', 'noodles', 'olives', 'pizza', 'quiche', 'rice', 'salad', 'toast',
  'vegetables', 'waffles', 'yoghurt', 'zucchini',
])
assert.deepEqual(HALLOWEEN_FOOD.map(item => item.name), ['melon', 'bacon', 'peas', 'peach', 'toast'])
assert.deepEqual(HALLOWEEN_DRINKS.map(item => item.name), ['juice'])
assert.equal(THANKSGIVING_FOOD.length, 9)
assert.equal(FANTASTIC_BEASTS_FOOD.length, 9)
assert.equal(CHINESE_NEW_YEAR_FOOD.length, 15)
assert.ok(CHINESE_NEW_YEAR_FOOD.every(item => item.hideLabel))
assert.deepEqual(menuForSections([]), { food: [], drinks: [] })
assert.deepEqual(menuForSections(DEFAULT_SECTIONS).food.map(item => item.id), FOOD.map(item => item.id))
assert.deepEqual(menuForSections(DEFAULT_SECTIONS).drinks.map(item => item.id), DRINKS.map(item => item.id))
assert.deepEqual(menuForSections(['food1', 'drinks']).food.map(item => item.id), FOOD_1.map(item => item.id))
assert.deepEqual(menuForSections(['food2', 'drinks']).food.map(item => item.id), FOOD_2.map(item => item.id))
assert.equal(menuForSections(['food1']).drinks.length, 0)
const halloweenMenu = menuForSections([...DEFAULT_SECTIONS, 'halloween'])
assert.equal(halloweenMenu.food.length, 27)
assert.equal(halloweenMenu.drinks.length, 9)
assert.equal(halloweenMenu.food.filter(item => item.id === 'toast').length, 1)
assert.equal(new Set(halloweenMenu.food.map(item => item.id)).size, 27)

const selectedMenu = menuForSections([...DEFAULT_SECTIONS, 'halloween', 'thanksgiving', 'fantasticBeasts', 'chineseNewYear'])
assert.equal(selectedMenu.food.length, 57)
assert.equal(selectedMenu.drinks.length, 9)
assert.equal(new Set(selectedMenu.food.map(item => item.id)).size, 57)
assert.ok(!selectedMenu.food.some(item => ['fish', 'noodles', 'lettuce'].includes(item.id)))

const classicItems = [...halloweenMenu.food, ...halloweenMenu.drinks]
const all = [...classicItems, ...THANKSGIVING_FOOD, ...FANTASTIC_BEASTS_FOOD, ...CHINESE_NEW_YEAR_FOOD]
assert.equal(new Set(all.map(item => item.id)).size, 69)
for (const item of all) assert.ok(existsSync(`public${item.image}`), `Missing illustration: ${item.image}`)
assert.ok(all.every(item => item.image.endsWith('.webp')))
const atlas = JSON.parse(readFileSync('src/data/orderAtlas.json', 'utf8'))
assert.ok(existsSync('public/assets/order-atlas.webp'))
assert.ok(statSync('public/assets/order-atlas.webp').size < 300_000, 'Order atlas exceeds the 300 KB budget')
assert.equal(atlas.columns * atlas.rows, 36)
assert.deepEqual(Object.keys(atlas.positions).sort(), classicItems.map(item => `${item.kind}:${item.id}`).sort())
assert.equal(new Set(Object.values(atlas.positions).map(position => position.join(','))).size, 36)
for (const position of Object.values(atlas.positions)) {
  assert.ok(position[0] >= 0 && position[0] < atlas.columns)
  assert.ok(position[1] >= 0 && position[1] < atlas.rows)
}
const sectionAtlases = JSON.parse(readFileSync('src/data/sectionAtlases.json', 'utf8'))
for (const [key, folder, items] of [
  ['thanksgiving', 'thanksgiving', THANKSGIVING_FOOD],
  ['fantasticBeasts', 'fantastic-beasts', FANTASTIC_BEASTS_FOOD],
  ['chineseNewYear', 'chinese-new-year', CHINESE_NEW_YEAR_FOOD],
]) {
  const path = `public/assets/sections/${folder}-atlas.webp`
  assert.ok(existsSync(path))
  assert.ok(statSync(path).size < 160_000, `${folder} atlas exceeds the 160 KB budget`)
  assert.deepEqual(Object.keys(sectionAtlases[key].positions).sort(), items.map(item => `food:${item.id}`).sort())
}
assert.ok(existsSync('public/assets/waiter.webp'))
assert.ok(existsSync('public/assets/restaurant-bg.webp'))
const webpPaths = [...all.map(item => `public${item.image}`), 'public/assets/waiter.webp', 'public/assets/restaurant-bg.webp']
const webpBytes = webpPaths.reduce((total, path) => total + statSync(path).size, 0)
assert.ok(webpBytes < 3_000_000, 'Web artwork exceeds the 3 MB asset budget')
for (const group of ['food', 'drinks']) {
  assert.equal(readdirSync(`public/assets/${group}`).filter(file => file.endsWith('.png')).length, 0)
}
assert.equal(readdirSync('public/assets').filter(file => file.endsWith('.png')).length, 0)

function signature(order) {
  return [...order.food.map(item => item.id).sort(), order.drink.id].join('|')
}

let previous = null
const seenFood = new Set()
const seenDrinks = new Set()
for (let i = 0; i < 2000; i++) {
  const order = generateOrder(previous)
  assert.ok(order.food.length >= 2 && order.food.length <= 4)
  assert.equal(new Set(order.food.map(item => item.id)).size, order.food.length)
  assert.ok(order.food.every(item => FOOD.some(food => food.id === item.id)))
  assert.ok(DRINKS.some(drink => drink.id === order.drink.id))
  if (previous) assert.notEqual(signature(order), signature(previous))
  order.food.forEach(item => seenFood.add(item.id))
  seenDrinks.add(order.drink.id)
  previous = order
}
assert.equal(seenFood.size, 23)
assert.equal(seenDrinks.size, 8)

previous = null
const seenHalloweenFood = new Set()
const seenHalloweenDrinks = new Set()
for (let i = 0; i < 2000; i++) {
  const order = generateOrder(previous, Math.random, [...DEFAULT_SECTIONS, 'halloween'])
  assert.ok(order.food.length >= 2 && order.food.length <= 4)
  assert.equal(new Set(order.food.map(item => item.id)).size, order.food.length)
  assert.ok(order.food.every(item => halloweenMenu.food.some(food => food.id === item.id)))
  assert.ok(halloweenMenu.drinks.some(drink => drink.id === order.drink.id))
  assert.ok(order.drink.id === 'juice' || order.food.some(item => ['melon', 'bacon', 'peas', 'peach'].includes(item.id)))
  if (previous) assert.notEqual(signature(order), signature(previous))
  order.food.forEach(item => seenHalloweenFood.add(item.id))
  seenHalloweenDrinks.add(order.drink.id)
  previous = order
}
assert.equal(seenHalloweenFood.size, 27)
assert.equal(seenHalloweenDrinks.size, 9)

const forcedFirst = generateOrder(null, () => 0)
const forcedSecond = generateOrder(forcedFirst, () => 0)
assert.notEqual(signature(forcedFirst), signature(forcedSecond))
const forcedHalloweenFirst = generateOrder(null, () => 0, [...DEFAULT_SECTIONS, 'halloween'])
const forcedHalloweenSecond = generateOrder(forcedHalloweenFirst, () => 0, [...DEFAULT_SECTIONS, 'halloween'])
assert.notEqual(signature(forcedHalloweenFirst), signature(forcedHalloweenSecond))
assert.ok(forcedHalloweenSecond.drink.id === 'juice' || forcedHalloweenSecond.food.some(item => ['melon', 'bacon', 'peas', 'peach'].includes(item.id)))
for (const [section, items] of [
  ['thanksgiving', THANKSGIVING_FOOD],
  ['fantasticBeasts', FANTASTIC_BEASTS_FOOD],
  ['chineseNewYear', CHINESE_NEW_YEAR_FOOD],
]) {
  const order = generateOrder(null, () => 0, ['drinks', section])
  assert.ok(order.food.some(item => items.some(extra => extra.id === item.id)))
}
const onlyHalloween = generateOrder(null, () => 0, ['halloween'])
const nextOnlyHalloween = generateOrder(onlyHalloween, () => 0, ['halloween'])
assert.notEqual(signature(onlyHalloween), signature(nextOnlyHalloween))
assert.equal(nextOnlyHalloween.drink.id, 'juice')
assert.throws(() => generateOrder(null, Math.random, ['food1']))
assert.throws(() => generateOrder(null, Math.random, ['drinks']))
console.log('Verified 3 basic groups, 4 extra sections, 4 compact atlases, and valid changing orders.')
