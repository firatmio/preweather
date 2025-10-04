import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/translate': {
        target: 'https://api-free.deepl.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/translate/, '/v2/translate'),
      }
    }
  }
})
