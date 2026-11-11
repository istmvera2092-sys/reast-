export function Waiter({ hasOrder }: { hasOrder: boolean }) {
  return (
    <div className="waiter" aria-label="A friendly waiter welcomes you">
      <div className="waiter__bubble">{hasOrder ? "Here's your order!" : 'Bonjour! Ready to order?'}</div>
      <img src={`${import.meta.env.BASE_URL}assets/waiter.png`} alt="A smiling waiter in a bow tie and apron" />
    </div>
  )
}
