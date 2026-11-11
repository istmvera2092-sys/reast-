import { DRINKS, EXTRA_SECTIONS, FOOD, type MenuItem, type SectionId } from '../data/menu'

export type Order = { food: MenuItem[]; drink: MenuItem }

export function menuForSections(sections: readonly SectionId[]) {
  const food = [...FOOD]
  const drinks = [...DRINKS]
  for (const section of sections) {
    for (const item of EXTRA_SECTIONS[section].food) {
      if (!food.some(existing => existing.id === item.id)) food.push(item)
    }
    for (const item of EXTRA_SECTIONS[section].drinks) {
      if (!drinks.some(existing => existing.id === item.id)) drinks.push(item)
    }
  }
  return { food, drinks }
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function signature(order: Order): string {
  return [...order.food.map(item => item.id).sort(), order.drink.id].join('|')
}

export function generateOrder(previous?: Order | null, random: () => number = Math.random, sections: readonly SectionId[] = []): Order {
  const menu = menuForSections(sections)
  const count = 2 + Math.floor(random() * 3)
  const food = shuffled(menu.food, random).slice(0, count)
  let drink = shuffled(menu.drinks, random)[0]
  const halloweenFood = sections.includes('halloween')
    ? EXTRA_SECTIONS.halloween.food.filter(item => !FOOD.some(base => base.id === item.id))
    : []
  const halloweenDrinks = sections.includes('halloween') ? EXTRA_SECTIONS.halloween.drinks : []

  if (halloweenFood.length && !food.some(item => halloweenFood.some(extra => extra.id === item.id)) &&
      !halloweenDrinks.some(item => item.id === drink.id)) {
    const featured = shuffled([...halloweenFood, ...halloweenDrinks], random)[0]
    if (featured.kind === 'drink') drink = featured
    else food[0] = featured
  }
  const order = { food, drink }

  // A matching selection is rare, but even then the next press must feel new.
  if (previous && signature(order) === signature(previous)) {
    if (halloweenFood.length && !food.some(item => halloweenFood.some(extra => extra.id === item.id))) {
      food[0] = halloweenFood[0]
    } else {
      drink = shuffled(menu.drinks.filter(item => item.id !== previous.drink.id), random)[0]
    }
  }
  return { food, drink }
}
