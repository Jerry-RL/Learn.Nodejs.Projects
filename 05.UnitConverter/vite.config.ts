import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
