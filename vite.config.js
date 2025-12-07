import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/MealMate-frontend/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'DailyDish',
        short_name: 'DailyDish',
        description: 'Plan your meals and save your favorite recipes easily.',
        theme_color: '#9722c5ff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/'
        // Icons temporarily disabled - add proper PWA icons later
        // icons: [
        //   {
        //     src: '/icons/pwa-192.png',
        //     sizes: '192x192',
        //     type: 'image/png'
        //   },
        //   {
        //     src: '/icons/pwa-192.png',
        //     sizes: '512x512',
        //     type: 'image/png'
        //   }
        // ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
            }
          }
        ]
      }
    })
  ]
})