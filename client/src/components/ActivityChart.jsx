const MONTHS = 12

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

export default function ActivityChart({ games }) {
  const now = new Date()
  const buckets = []

  for (let i = MONTHS - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: monthKey(date),
      label: date.toLocaleDateString(undefined, { month: 'short' }),
      isJanuary: date.getMonth() === 0,
      year: date.getFullYear(),
      count: 0,
    })
  }

  const index = new Map(buckets.map((b) => [b.key, b]))
  for (const game of games) {
    const bucket = index.get(monthKey(new Date(game.addedAt)))
    if (bucket) bucket.count += 1
  }

  const max = Math.max(...buckets.map((b) => b.count), 1)
  const total = buckets.reduce((sum, b) => sum + b.count, 0)

  return (
    <div className="chart-block">
      <div className="chart-head">
        <h3>Added over the last year</h3>
        <span className="chart-meta">{total} games</span>
      </div>

      <div className="activity">
        {buckets.map((bucket) => (
          <div className="activity-col" key={bucket.key}>
            <span className="activity-count">{bucket.count || ''}</span>
            <div className="activity-track">
              <div
                className="activity-fill"
                style={{ height: `${(bucket.count / max) * 100}%` }}
                title={`${bucket.count} in ${bucket.label} ${bucket.year}`}
              />
            </div>
            <span className="activity-label">{bucket.isJanuary ? bucket.year : bucket.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
