export type MenuItem = {
  id: string
  name: string
  image: string
  kind: 'food' | 'drink'
  atlas?: SeasonalAtlas
  hideLabel?: boolean
  replaces?: string
}

export type SeasonalAtlas = 'thanksgiving' | 'fantasticBeasts' | 'chineseNewYear'

export const ORDER_ATLAS_URL = `${import.meta.env.BASE_URL}assets/order-atlas.webp`
export const SECTION_ATLAS_URLS: Record<SeasonalAtlas, string> = {
  thanksgiving: `${import.meta.env.BASE_URL}assets/sections/thanksgiving-atlas.webp`,
  fantasticBeasts: `${import.meta.env.BASE_URL}assets/sections/fantastic-beasts-atlas.webp`,
  chineseNewYear: `${import.meta.env.BASE_URL}assets/sections/chinese-new-year-atlas.webp`,
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

function seasonalFood(atlas: SeasonalAtlas, folder: string, entries: readonly (readonly [string, string])[]): MenuItem[] {
  return entries.map(([id, name]) => ({
    id,
    name,
    image: `${import.meta.env.BASE_URL}assets/sections/${folder}/${id}.webp`,
    kind: 'food',
    atlas,
  }))
}

export const THANKSGIVING_FOOD = seasonalFood('thanksgiving', 'thanksgiving', [
  ['pumpkin-pie', 'pumpkin pie'],
  ['yam', 'yam'],
  ['mashed-potato', 'mashed potato'],
  ['stuffing', 'stuffing'],
  ['turkey', 'turkey'],
  ['cooked-carrot', 'cooked carrot'],
  ['biscuits', 'biscuits'],
  ['cranberry-sauce', 'cranberry sauce'],
  ['corn', 'corn'],
])

export const FANTASTIC_BEASTS_FOOD = seasonalFood('fantasticBeasts', 'fantastic-beasts', [
  ['yorkshire-pudding', 'Yorkshire pudding'],
  ['fried-chicken', 'fried chicken'],
  ['porridge', 'porridge'],
  ['roasted-potato-and-pumpkin', 'roasted potato and pumpkin'],
  ['stew', 'stew'],
  ['toast-with-jam', 'toast with jam'],
  ['pumpkin-patties', 'pumpkin patties'],
  ['bacon-and-eggs', 'bacon and eggs'],
  ['chocolate-frog', 'chocolate frog'],
])

const chineseFoods = [
  { id: 'cn-fish', name: 'fish', replaces: 'fish' },
  { id: 'cn-dumplings', name: 'dumplings' },
  { id: 'cn-chicken', name: 'chicken' },
  { id: 'cn-new-year-cake', name: 'new year cake' },
  { id: 'cn-spring-rolls', name: 'spring rolls' },
  { id: 'cn-sweet-rice-balls', name: 'sweet rice balls' },
  { id: 'cn-noodles', name: 'noodles', replaces: 'noodles' },
  { id: 'cn-meatballs', name: 'meatballs' },
  { id: 'cn-steamed-pork', name: 'steamed pork' },
  { id: 'cn-shrimps', name: 'shrimps' },
  { id: 'cn-lettuce', name: 'lettuce', replaces: 'lettuce' },
  { id: 'cn-baby-bok-choy', name: 'baby bok choy' },
  { id: 'cn-chinese-broccoli', name: 'chinese broccoli' },
  { id: 'cn-tangerines', name: 'tangerines' },
  { id: 'cn-oranges', name: 'oranges' },
] as const

export const CHINESE_NEW_YEAR_FOOD: MenuItem[] = chineseFoods.map(item => ({
  ...item,
  image: `${import.meta.env.BASE_URL}assets/sections/chinese-new-year/${item.id}.webp`,
  kind: 'food',
  atlas: 'chineseNewYear',
  hideLabel: true,
}))

export const EXTRA_SECTIONS = {
  halloween: { label: 'HALLOWEEN', food: HALLOWEEN_FOOD, drinks: HALLOWEEN_DRINKS, atlas: null },
  thanksgiving: { label: 'THANKSGIVING DAY', food: THANKSGIVING_FOOD, drinks: [], atlas: 'thanksgiving' },
  fantasticBeasts: { label: 'FANTASTIC BEASTS', food: FANTASTIC_BEASTS_FOOD, drinks: [], atlas: 'fantasticBeasts' },
  chineseNewYear: { label: 'CHINESE NEW YEAR', food: CHINESE_NEW_YEAR_FOOD, drinks: [], atlas: 'chineseNewYear' },
} as const

export type SectionId = keyof typeof EXTRA_SECTIONS
