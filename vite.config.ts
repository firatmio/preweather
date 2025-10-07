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
      },
      '/api/geocode': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Parse query parameters
            const url = new URL(req.url || '', 'http://localhost')
            const type = url.searchParams.get('type')
            const lat = url.searchParams.get('lat')
            const lon = url.searchParams.get('lon')
            const q = url.searchParams.get('q')
            const lang = url.searchParams.get('lang') || 'en'

            let newPath = ''
            if (type === 'reverse' && lat && lon) {
              newPath = `/reverse?lat=${lat}&lon=${lon}&format=jsonv2&accept-language=${lang}`
            } else if (type === 'search' && q) {
              newPath = `/search?format=jsonv2&addressdetails=1&limit=6&accept-language=${lang}&q=${encodeURIComponent(q)}`
            }

            if (newPath) {
              proxyReq.path = newPath
            }

            // Add User-Agent header for Nominatim
            proxyReq.setHeader('User-Agent', 'PreWeather-Dev/1.0')
          })
        }
      }
    }
  }
})
