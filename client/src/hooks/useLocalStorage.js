import { useState, useEffect } from 'react'

/**
 * State'i localStorage ile senkron tutan hook.
 * initialValue bir fonksiyon olabilir — sadece kayıt yoksa çağrılır.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch {
      // Bozuk JSON veya erişim engeli — başlangıç değerine düş.
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Kota dolu veya private mode — sessizce geç.
    }
  }, [key, value])

  return [value, setValue]
}
