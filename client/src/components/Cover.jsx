import { useState } from 'react'

// Kapak yoksa ya da yüklenemezse oyunun adından türetilen bir desen gösteriyoruz.
function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function hueFrom(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360
  return hash
}

export default function Cover({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    const hue = hueFrom(name)
    return (
      <div
        className={`cover cover-fallback ${className}`}
        style={{
          background: `linear-gradient(150deg, hsl(${hue} 45% 28%), hsl(${(hue + 40) % 360} 40% 16%))`,
        }}
        aria-hidden="true"
      >
        <span>{initials(name)}</span>
      </div>
    )
  }

  return (
    <img
      className={`cover ${className}`}
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
