import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  base: '/max-miniapp/',
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 4175,
    strictPort: true,
  },
})
