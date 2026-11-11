import { DRINKS, FOOD, type MenuItem } from '../data/menu'

export type Order = { food: MenuItem[]; drink: MenuItem }

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

export function generateOrder(previous?: Order | null, random: () => number = Math.random): Order {
  const count = 2 + Math.floor(random() * 3)
  const food = shuffled(FOOD, random).slice(0, count)
  let drink = shuffled(DRINKS, random)[0]
  const order = { food, drink }

  // A matching selection is rare, but even then the next press must feel new.
  if (previous && signature(order) === signature(previous)) {
    drink = shuffled(DRINKS.filter(item => item.id !== previous.drink.id), random)[0]
  }
  return { food, drink }
}
