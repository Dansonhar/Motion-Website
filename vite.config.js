import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from https://dansonhar.github.io/gym_motion_site/ on GitHub Pages
  base: '/gym_motion_site/',
  plugins: [react(), tailwindcss()],
})
