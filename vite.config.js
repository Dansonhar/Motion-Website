import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from https://dansonhar.github.io/Motion-Website/ on GitHub Pages
  base: '/Motion-Website/',
  plugins: [react(), tailwindcss()],
})
