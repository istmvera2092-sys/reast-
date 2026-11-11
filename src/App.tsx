import { useState } from 'react'
import { MenuPanel } from './components/MenuPanel'
import { Waiter } from './components/Waiter'
import { OrderResult } from './components/OrderResult'
import { FOOD, DRINKS } from './data/menu'
import { generateOrder, type Order } from './utils/generateOrder'
import './App.css'

function App() {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderNumber, setOrderNumber] = useState(0)

  function handleOrder() {
    setOrder(previous => generateOrder(previous))
    setOrderNumber(number => number + 1)
  }

  return (
    <main className="game-shell">
      <div className="game-shell__inner">
        <header className="masthead">
          <div className="masthead__eyebrow"><span aria-hidden="true">✦</span> A LITTLE PARIS BISTRO <span aria-hidden="true">✦</span></div>
          <h1>RESTAURANT</h1>
          <p>Explore the menu and see what’s served!</p>
          <Waiter hasOrder={order !== null} />
        </header>

        <div className="menu-layout">
          <MenuPanel title="FOOD" items={FOOD} />
          <MenuPanel title="DRINKS" items={DRINKS} />
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

        <OrderResult order={order} number={orderNumber} />
        <footer className="footer-note">Bon appétit!</footer>
      </div>
    </main>
  )
}

export default App
