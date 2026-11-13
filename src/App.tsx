import { useEffect, useState } from 'react'
import { OrderResult } from './components/OrderResult'
import { Waiter } from './components/Waiter'
import { EXTRA_SECTIONS, ORDER_ATLAS_URL, SECTION_ATLAS_URLS, type SectionId } from './data/menu'
import { generateOrder, type Order } from './utils/generateOrder'
import './App.css'

function App() {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderNumber, setOrderNumber] = useState(0)
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([])

  useEffect(() => {
    const image = new Image()
    image.src = ORDER_ATLAS_URL
    void image.decode().catch(() => {})
  }, [])

  useEffect(() => {
    for (const section of selectedSections) {
      const atlas = EXTRA_SECTIONS[section].atlas
      if (!atlas) continue
      const image = new Image()
      image.src = SECTION_ATLAS_URLS[atlas]
      void image.decode().catch(() => {})
    }
  }, [selectedSections])

  function handleOrder() {
    setOrder(previous => generateOrder(previous, Math.random, selectedSections))
    setOrderNumber(number => number + 1)
  }

  function toggleSection(section: SectionId) {
    setSelectedSections(previous => previous.includes(section)
      ? previous.filter(value => value !== section)
      : [...previous, section])
  }

  return (
    <main className="game-shell">
      <div className="scene-layout">
        <Waiter />
        <div className="game-shell__inner">
          <OrderResult order={order} number={orderNumber} />
          <div className="section-picker" role="group" aria-label="Extra menu sections">
            {(Object.keys(EXTRA_SECTIONS) as SectionId[]).map(section => (
              <button
                className="section-picker__button"
                type="button"
                aria-pressed={selectedSections.includes(section)}
                onClick={() => toggleSection(section)}
                key={section}
              >
                <span aria-hidden="true">✦</span>
                {EXTRA_SECTIONS[section].label}
              </button>
            ))}
          </div>
          <div className="order-action">
            <span className="order-action__line" aria-hidden="true" />
            <button className="order-button" type="button" onClick={handleOrder}>
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
