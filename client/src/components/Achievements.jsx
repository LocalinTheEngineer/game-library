export default function Achievements({ items }) {
  const unlocked = items.filter((a) => a.unlocked).length

  return (
    <div className="chart-block">
      <div className="chart-head">
        <h3>Achievements</h3>
        <span className="chart-meta">
          {unlocked} of {items.length}
        </span>
      </div>

      <ul className="achievements">
        {items.map((item) => (
          <li key={item.id} className={item.unlocked ? 'unlocked' : ''}>
            <div className="achievement-top">
              <span className="achievement-name">{item.name}</span>
              {item.unlocked && <span className="achievement-tick">✓</span>}
            </div>
            <p className="achievement-desc">{item.description}</p>
            {!item.unlocked && (
              <>
                <div className="achievement-track">
                  <div
                    className="achievement-fill"
                    style={{ width: `${Math.round(item.progress * 100)}%` }}
                  />
                </div>
                <span className="achievement-count">
                  {item.value}
                  {item.unit || ''} / {item.target}
                  {item.unit || ''}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
