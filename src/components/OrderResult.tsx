import type { CSSProperties } from 'react'
import atlas from '../data/orderAtlas.json'
import { ORDER_ATLAS_URL } from '../data/menu'
import type { Order } from '../utils/generateOrder'

const positions: Record<string, number[]> = atlas.positions

export function OrderResult({ order, number }: { order: Order | null; number: number }) {
  return (
    <section className={`order-result ${order ? 'order-result--filled' : ''}`} aria-labelledby="order-title" aria-live="polite" aria-atomic="true">
      <div className="order-result__heading">
        <span className="ticket-star" aria-hidden="true">✧</span>
        <h2 id="order-title">YOUR ORDER</h2>
        <span className="ticket-star" aria-hidden="true">✧</span>
      </div>
      {order ? (
        <div className="order-result__content" key={number}>
          <p className="order-result__served">Here's your order!</p>
          <div className="order-result__items">
            {[...order.food, order.drink].map(item => {
              const [column, row] = positions[`${item.kind}:${item.id}`]
              const position = {
                '--atlas-column': column,
                '--atlas-row': row,
                '--atlas-columns': atlas.columns,
                '--atlas-rows': atlas.rows,
              } as CSSProperties
              return <div className="order-item" key={item.id}>
                <div className="order-item__picture">
                  <img src={ORDER_ATLAS_URL} alt={`${item.name} illustration`} style={position} />
                </div>
                <span>{item.name}</span>
              </div>
            })}
          </div>
        </div>
      ) : <div className="order-result__empty"><p className="order-result__prompt">Press ORDER to get your meal!</p></div>}
    </section>
  )
}
