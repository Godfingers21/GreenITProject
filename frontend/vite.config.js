import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  trailingSlash: true,
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://greenitproject.onrender.com', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})