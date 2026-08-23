import { useState, useEffect } from 'react'

function parse() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [section, value] = raw.split('/')

  if (section === 'u' && value) {
    return { name: 'profile', username: decodeURIComponent(value) }
  }
  return { name: 'app' }
}

// GitHub Pages statik dosya sunduğu için sunucu tarafı yönlendirme yok;
// hash tabanlı adresler yenilemede de çalışıyor.
export function useHashRoute() {
  const [route, setRoute] = useState(parse)

  useEffect(() => {
    const update = () => setRoute(parse())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const goHome = () => {
    window.location.hash = ''
  }

  return { route, goHome }
}
