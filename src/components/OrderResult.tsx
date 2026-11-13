import type { CSSProperties } from 'react'
import atlas from '../data/orderAtlas.json'
import sectionAtlases from '../data/sectionAtlases.json'
import { ORDER_ATLAS_URL, SECTION_ATLAS_URLS } from '../data/menu'
import type { Order } from '../utils/generateOrder'

export function OrderResult({ order, number, prompt }: { order: Order | null; number: number; prompt: string }) {
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
              const itemAtlas = item.atlas ? sectionAtlases[item.atlas] : atlas
              const positions: Record<string, number[]> = itemAtlas.positions
              const [column, row] = positions[`${item.kind}:${item.id}`]
              const position = {
                '--atlas-column': column,
                '--atlas-row': row,
                '--atlas-columns': itemAtlas.columns,
                '--atlas-rows': itemAtlas.rows,
              } as CSSProperties
              return <div className={`order-item ${item.hideLabel ? 'order-item--image-only' : ''}`} key={item.id}>
                <div className="order-item__picture">
                  <img src={item.atlas ? SECTION_ATLAS_URLS[item.atlas] : ORDER_ATLAS_URL} alt={`${item.name} illustration`} style={position} />
                </div>
                {!item.hideLabel && <span>{item.name}</span>}
              </div>
            })}
          </div>
        </div>
      ) : <div className="order-result__empty"><p className="order-result__prompt">{prompt}</p></div>}
    </section>
  )
}
