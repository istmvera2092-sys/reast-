import type { MenuItem } from '../data/menu'

type Props = { title: 'FOOD' | 'DRINKS'; items: MenuItem[] }

export function MenuPanel({ title, items }: Props) {
  return (
    <section className={`menu-panel menu-panel--${title.toLowerCase()}`} aria-labelledby={`${title.toLowerCase()}-title`}>
      <div className="panel-heading">
        <span className="heading-flourish" aria-hidden="true">✦</span>
        <h2 id={`${title.toLowerCase()}-title`}>{title}</h2>
        <span className="heading-flourish" aria-hidden="true">✦</span>
      </div>
      <div className="menu-grid">
        {items.map(item => <div className="menu-item" key={item.id}>
          <div className="menu-item__picture"><img src={item.image} alt={`${item.name} illustration`} /></div>
          <span>{item.name}</span>
        </div>)}
      </div>
    </section>
  )
}
