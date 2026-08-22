export default function BarChart({ title, rows }) {
  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <div className="chart-block">
      <h3>{title}</h3>
      {rows.map((row) => (
        <div className="bar-row" key={row.label}>
          <span className="bar-label">{row.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.round((row.count / max) * 100)}%`,
                background: row.color || 'var(--accent)',
              }}
            />
          </div>
          <span className="bar-count">{row.count}</span>
        </div>
      ))}
    </div>
  )
}
