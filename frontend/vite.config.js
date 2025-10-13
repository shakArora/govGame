import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/govGame/',
  plugins: [react()],
  server: {
    port: 5173
  }
})

