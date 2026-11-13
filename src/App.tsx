import { useEffect, useState } from 'react'
import { OrderResult } from './components/OrderResult'
import { Waiter } from './components/Waiter'
import { BASE_SECTIONS, DEFAULT_SECTIONS, EXTRA_SECTIONS, ORDER_ATLAS_URL, SECTIONS, SECTION_ATLAS_URLS, type SectionId } from './data/menu'
import { generateOrder, menuForSections, type Order } from './utils/generateOrder'
import './App.css'

type MenuSide = 'base' | 'extras'

function App() {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderNumber, setOrderNumber] = useState(0)
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([...DEFAULT_SECTIONS])
  const [hoveredMenu, setHoveredMenu] = useState<MenuSide | null>(null)
  const [focusedMenu, setFocusedMenu] = useState<MenuSide | null>(null)
  const [pinnedMenu, setPinnedMenu] = useState<MenuSide | null>(null)
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
    setPinnedMenu(null)
  }

  function sectionButton(section: SectionId, base = false) {
    return <button
      className={`section-picker__button ${base ? 'section-picker__button--base' : ''}`}
      type="button"
      aria-pressed={selectedSections.includes(section)}
      onClick={event => {
        toggleSection(section)
        if (event.detail > 0) event.currentTarget.blur()
      }}
      key={section}
    >
      <span aria-hidden="true">✦</span>
      {SECTIONS[section].label}
    </button>
  }

  function menuDrawer(side: MenuSide, sections: SectionId[]) {
    const open = hoveredMenu === side || focusedMenu === side || pinnedMenu === side
    const base = side === 'base'
    const panelId = base ? 'basic-menu-panel' : 'extra-menu-panel'
    return <aside
      className={`edge-menu edge-menu--${side} ${open ? 'edge-menu--open' : ''}`}
      aria-label={base ? 'Food and drinks menu' : 'Themed food menu'}
      onPointerEnter={event => {
        if (event.pointerType !== 'touch') {
          setHoveredMenu(side)
          setPinnedMenu(current => current === side ? current : null)
        }
      }}
      onPointerLeave={event => { if (event.pointerType !== 'touch') setHoveredMenu(current => current === side ? null : current) }}
      onFocus={() => {
        setFocusedMenu(side)
        setPinnedMenu(current => current === side ? current : null)
      }}
      onBlur={event => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setFocusedMenu(current => current === side ? null : current)
        }
      }}
      key={side}
    >
      <button
        className="edge-menu__handle"
        type="button"
        aria-label={base ? 'Show food and drinks' : 'Show themed sections'}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={event => {
          if (pinnedMenu === side) {
            setPinnedMenu(null)
            if (event.detail > 0) event.currentTarget.blur()
          } else {
            setPinnedMenu(side)
          }
        }}
      >
        <span className="edge-menu__arrow" aria-hidden="true">{base ? '›' : '‹'}</span>
        <span className="edge-menu__handle-label" aria-hidden="true">{base ? 'MENU' : 'THEMES'}</span>
      </button>
      <div className="edge-menu__panel" id={panelId} aria-hidden={!open} inert={!open}>
        <h2>{base ? 'FOOD & DRINKS' : 'SPECIAL MENUS'}</h2>
        <p>{base ? 'Choose your food and drink groups.' : 'Add a themed section to your order.'}</p>
        <div className="edge-menu__buttons">
          {sections.map(section => sectionButton(section, base))}
        </div>
      </div>
    </aside>
  }

  return (
    <main className="game-shell">
      <div className="scene-layout">
        <Waiter />
        <div className="game-shell__inner">
          <OrderResult order={order} number={orderNumber} prompt={prompt} />
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
      <div className="menu-drawers">
        {menuDrawer('base', Object.keys(BASE_SECTIONS) as SectionId[])}
        {menuDrawer('extras', Object.keys(EXTRA_SECTIONS) as SectionId[])}
      </div>
    </main>
  )
}

export default App
