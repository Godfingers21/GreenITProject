import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vercel from 'vite-plugin-vercel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),vercel()],
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