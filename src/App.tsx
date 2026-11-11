import { useState } from 'react'
import { OrderResult } from './components/OrderResult'
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
        <OrderResult order={order} number={orderNumber} />
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
    </main>
  )
}

export default App
