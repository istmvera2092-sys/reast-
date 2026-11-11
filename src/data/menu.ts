export type MenuItem = {
  id: string
  name: string
  image: string
  kind: 'food' | 'drink'
}

export const ORDER_ATLAS_URL = `${import.meta.env.BASE_URL}assets/order-atlas.webp`

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

const halloweenFoods = [
  ['melon', 'melon'],
  ['bacon', 'bacon'],
  ['peas', 'peas'],
  ['peach', 'peach'],
] as const

export const HALLOWEEN_FOOD: MenuItem[] = [
  ...halloweenFoods.map(([id, name]) => ({
    id,
    name,
    image: `${import.meta.env.BASE_URL}assets/food/${id}.webp`,
    kind: 'food' as const,
  })),
  ...FOOD.filter(item => item.id === 'toast'),
]

export const HALLOWEEN_DRINKS: MenuItem[] = [{
  id: 'juice',
  name: 'juice',
  image: `${import.meta.env.BASE_URL}assets/drinks/juice.webp`,
  kind: 'drink',
}]

export const EXTRA_SECTIONS = {
  halloween: { label: 'HALLOWEEN', food: HALLOWEEN_FOOD, drinks: HALLOWEEN_DRINKS },
} as const

export type SectionId = keyof typeof EXTRA_SECTIONS
