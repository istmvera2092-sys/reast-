import { useEffect, useState } from 'react'
import { OrderResult } from './components/OrderResult'
import { Waiter } from './components/Waiter'
import { BASE_SECTIONS, DEFAULT_SECTIONS, EXTRA_SECTIONS, ORDER_ATLAS_URL, SECTIONS, SECTION_ATLAS_URLS, type SectionId } from './data/menu'
import { generateOrder, menuForSections, type Order } from './utils/generateOrder'
import './App.css'

function App() {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderNumber, setOrderNumber] = useState(0)
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([...DEFAULT_SECTIONS])
  const menu = menuForSections(selectedSections)
  const canOrder = menu.food.length >= 2 && menu.drinks.length > 0
  const prompt = menu.food.length < 2
    ? 'Choose a food section to order!'
    : menu.drinks.length === 0
      ? 'Choose DRINKS or HALLOWEEN for a drink!'
      : 'Press ORDER to get your meal!'

  useEffect(() => {
    const image = new Image()
    image.src = ORDER_ATLAS_URL
    void image.decode().catch(() => {})
  }, [])

  useEffect(() => {
    for (const section of selectedSections) {
      const atlas = SECTIONS[section].atlas
      if (!atlas) continue
      const image = new Image()
      image.src = SECTION_ATLAS_URLS[atlas]
      void image.decode().catch(() => {})
    }
  }, [selectedSections])

  function handleOrder() {
    if (!canOrder) return
    setOrder(previous => generateOrder(previous, Math.random, selectedSections))
    setOrderNumber(number => number + 1)
  }

  function toggleSection(section: SectionId) {
    setSelectedSections(previous => previous.includes(section)
      ? previous.filter(value => value !== section)
      : [...previous, section])
    setOrder(null)
  }

  function sectionButton(section: SectionId, base = false) {
    return <button
      className={`section-picker__button ${base ? 'section-picker__button--base' : ''}`}
      type="button"
      aria-pressed={selectedSections.includes(section)}
      onClick={() => toggleSection(section)}
      key={section}
    >
      <span aria-hidden="true">✦</span>
      {SECTIONS[section].label}
    </button>
  }

  return (
    <main className="game-shell">
      <div className="scene-layout">
        <Waiter />
        <div className="game-shell__inner">
          <OrderResult order={order} number={orderNumber} prompt={prompt} />
          <div className="section-picker">
            <div className="section-picker__group" role="group" aria-label="Basic food and drinks">
              {(Object.keys(BASE_SECTIONS) as SectionId[]).map(section => sectionButton(section, true))}
            </div>
            <div className="section-picker__group" role="group" aria-label="Extra menu sections">
              {(Object.keys(EXTRA_SECTIONS) as SectionId[]).map(section => sectionButton(section))}
            </div>
          </div>
          <div className="order-action">
            <span className="order-action__line" aria-hidden="true" />
            <button className="order-button" type="button" onClick={handleOrder} disabled={!canOrder}>
              <span className="order-button__icon" aria-hidden="true">✦</span>
              ORDER
              <span className="order-button__icon" aria-hidden="true">✦</span>
            </button>
            <span className="order-action__line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
