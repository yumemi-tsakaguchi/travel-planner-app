import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/travel-planner-app/',
  server: {
    port: 5173,
    host: 'localhost',
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
