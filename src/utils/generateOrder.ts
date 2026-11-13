import { DEFAULT_SECTIONS, DRINKS, FOOD, SECTIONS, type MenuItem, type SectionId } from '../data/menu'

export type Order = { food: MenuItem[]; drink: MenuItem }

export function menuForSections(sections: readonly SectionId[] = DEFAULT_SECTIONS) {
  const food: MenuItem[] = []
  const drinks: MenuItem[] = []
  for (const section of sections) {
    for (const item of SECTIONS[section].food) {
      if (item.replaces) {
        const replaced = food.findIndex(existing => existing.id === item.replaces)
        if (replaced >= 0) food.splice(replaced, 1)
      }
      if (!food.some(existing => existing.id === item.id)) food.push(item)
    }
    for (const item of SECTIONS[section].drinks) {
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

export function generateOrder(previous?: Order | null, random: () => number = Math.random, sections: readonly SectionId[] = DEFAULT_SECTIONS): Order {
  const menu = menuForSections(sections)
  if (menu.food.length < 2 || menu.drinks.length === 0) throw new Error('Select food and a drink before ordering')
  const count = 2 + Math.floor(random() * 3)
  const food = shuffled(menu.food, random).slice(0, count)
  let drink = shuffled(menu.drinks, random)[0]
  const featuredFood = sections.flatMap(section => SECTIONS[section].food)
    .filter(item => !FOOD.some(base => base.id === item.id))
  const featuredDrinks = sections.flatMap(section => SECTIONS[section].drinks)
    .filter(item => !DRINKS.some(base => base.id === item.id))

  if (featuredFood.length && !food.some(item => featuredFood.some(extra => extra.id === item.id)) &&
      !featuredDrinks.some(item => item.id === drink.id)) {
    const featured = shuffled([...featuredFood, ...featuredDrinks], random)[0]
    if (featured.kind === 'drink') drink = featured
    else food[0] = featured
  }
  const order = { food, drink }

  // A matching selection is rare, but even then the next press must feel new.
  if (previous && signature(order) === signature(previous)) {
    if (featuredFood.length && !food.some(item => featuredFood.some(extra => extra.id === item.id))) {
      food[0] = featuredFood[0]
    } else {
      const otherDrinks = menu.drinks.filter(item => item.id !== previous.drink.id)
      if (otherDrinks.length) {
        drink = shuffled(otherDrinks, random)[0]
      } else {
        const replacement = menu.food.find(item => !food.some(selected => selected.id === item.id))
        if (replacement) {
          const unfeatured = food.findIndex(item => !featuredFood.some(extra => extra.id === item.id))
          food[unfeatured >= 0 ? unfeatured : 0] = replacement
        }
      }
    }
  }
  return { food, drink }
}
