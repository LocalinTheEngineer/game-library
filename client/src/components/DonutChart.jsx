const SIZE = 168
const STROKE = 22
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function DonutChart({ segments, centerValue, centerLabel }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0)

  let offset = 0
  const arcs = segments
    .filter((s) => s.count > 0)
    .map((segment) => {
      const fraction = segment.count / total
      const arc = {
        ...segment,
        dash: fraction * CIRCUMFERENCE,
        offset,
        percent: Math.round(fraction * 100),
      }
      offset += arc.dash
      return arc
    })

  return (
    <div className="donut">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.dash} ${CIRCUMFERENCE - arc.dash}`}
            strokeDashoffset={-arc.offset}
            // Yay 12 yönünden başlasın diye çeyrek tur geri çeviriyoruz.
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        ))}
        <text className="donut-value" x="50%" y="47%" textAnchor="middle" dominantBaseline="middle">
          {centerValue}
        </text>
        <text className="donut-label" x="50%" y="62%" textAnchor="middle" dominantBaseline="middle">
          {centerLabel}
        </text>
      </svg>

      <ul className="donut-legend">
        {arcs.map((arc) => (
          <li key={arc.label}>
            <span className="legend-dot" style={{ background: arc.color }} />
            <span className="legend-label">{arc.label}</span>
            <span className="legend-count">{arc.count}</span>
            <span className="legend-percent">{arc.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
