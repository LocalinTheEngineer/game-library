import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: repo adı — GitHub Pages alt klasörde yayınladığı için gerekli.
// Kendi repo adın farklıysa burayı değiştir.
export default defineConfig({
  plugins: [react()],
  base: '/game-library/',
})
