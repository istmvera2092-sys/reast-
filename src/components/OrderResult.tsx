import type { Order } from '../utils/generateOrder'

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
            {[...order.food, order.drink].map(item => <div className="order-item" key={item.id}>
              <img src={item.image} alt={`${item.name} illustration`} />
              <span>{item.name}</span>
            </div>)}
          </div>
        </div>
      ) : <div className="order-result__empty"><p className="order-result__prompt">Press ORDER to get your meal!</p></div>}
    </section>
  )
}
