import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { build } from 'esbuild'

async function loadTypeScript(entryPoint) {
  const result = await build({ entryPoints: [entryPoint], bundle: true, platform: 'node', format: 'esm', write: false, define: { 'import.meta.env.BASE_URL': "'/'" } })
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].contents).toString('base64')}`)
}

const { FOOD, DRINKS } = await loadTypeScript('src/data/menu.ts')
const { generateOrder } = await loadTypeScript('src/utils/generateOrder.ts')

assert.deepEqual(FOOD.map(item => item.name), [
  'apples', 'bananas', 'cheese', 'doughnuts', 'eggs', 'fish', 'grapes', 'hot dogs',
  'ice-cream', 'ketchup', 'lettuce', 'mayonnaise', 'noodles', 'olives', 'pizza',
  'quiche', 'rice', 'salad', 'toast', 'vegetables', 'waffles', 'yoghurt', 'zucchini',
])
assert.deepEqual(DRINKS.map(item => item.name), [
  'orange juice', 'milk', 'lemonade', 'cola', 'water', 'hot chocolate', 'tea', 'milkshake',
])

const all = [...FOOD, ...DRINKS]
assert.equal(new Set(all.map(item => item.id)).size, 31)
for (const item of all) assert.ok(existsSync(`public${item.image}`), `Missing illustration: ${item.image}`)
assert.ok(existsSync('public/assets/waiter.png'))
assert.ok(existsSync('public/assets/restaurant-bg.png'))

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

const forcedFirst = generateOrder(null, () => 0)
const forcedSecond = generateOrder(forcedFirst, () => 0)
assert.notEqual(signature(forcedFirst), signature(forcedSecond))
console.log('Verified exact menu, 33 local assets, and 2000 valid changing orders.')
