import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
    server: {
    port: 5173,               // ensure Electron loads this
    strictPort: true,         // fail if 5173 is not available
    cors: true,               // allow cross-origin requests (important for Electron)
    origin: 'http://localhost:5173',
  },
  build: {
    target: 'esnext',
  },
})
