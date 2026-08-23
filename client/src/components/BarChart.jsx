export default function BarChart({ title, rows, unit = '' }) {
  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <div className="chart-block">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="chart-empty">Not enough data yet.</p>
      ) : (
        rows.map((row) => (
          <div className="bar-row" key={row.label}>
            <span className="bar-label">{row.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.max((row.count / max) * 100, row.count > 0 ? 3 : 0)}%`,
                  background: row.color || 'var(--accent)',
                }}
              />
            </div>
            <span className="bar-count">
              {row.count}
              {unit}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
