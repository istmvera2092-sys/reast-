export type MenuItem = {
  id: string
  name: string
  image: string
  kind: 'food' | 'drink'
}

const foods = [
  ['apples', 'apples'],
  ['bananas', 'bananas'],
  ['cheese', 'cheese'],
  ['doughnuts', 'doughnuts'],
  ['eggs', 'eggs'],
  ['fish', 'fish'],
  ['grapes', 'grapes'],
  ['hot-dogs', 'hot dogs'],
  ['ice-cream', 'ice-cream'],
  ['ketchup', 'ketchup'],
  ['lettuce', 'lettuce'],
  ['mayonnaise', 'mayonnaise'],
  ['noodles', 'noodles'],
  ['olives', 'olives'],
  ['pizza', 'pizza'],
  ['quiche', 'quiche'],
  ['rice', 'rice'],
  ['salad', 'salad'],
  ['toast', 'toast'],
  ['vegetables', 'vegetables'],
  ['waffles', 'waffles'],
  ['yoghurt', 'yoghurt'],
  ['zucchini', 'zucchini'],
] as const

const drinks = [
  ['orange-juice', 'orange juice'],
  ['milk', 'milk'],
  ['lemonade', 'lemonade'],
  ['cola', 'cola'],
  ['water', 'water'],
  ['hot-chocolate', 'hot chocolate'],
  ['tea', 'tea'],
  ['milkshake', 'milkshake'],
] as const

export const FOOD: MenuItem[] = foods.map(([id, name]) => ({
  id,
  name,
  image: `${import.meta.env.BASE_URL}assets/food/${id}.webp`,
  kind: 'food',
}))

export const DRINKS: MenuItem[] = drinks.map(([id, name]) => ({
  id,
  name,
  image: `${import.meta.env.BASE_URL}assets/drinks/${id}.webp`,
  kind: 'drink',
}))
