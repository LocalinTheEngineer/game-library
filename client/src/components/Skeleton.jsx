export function CardSkeleton() {
  return (
    <div className="game-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-art" />
      <div className="card-body">
        <div className="skeleton skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton skeleton-line" style={{ width: '45%' }} />
      </div>
    </div>
  )
}

export default function LibrarySkeleton({ count = 6 }) {
  return (
    <div className="library-grid">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
