// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    cors: false, // enables CORS headers on the dev server
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})