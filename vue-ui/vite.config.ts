import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  define: {
    // Expose Aspire service URLs to the client
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.services__api__https__0 || 
      process.env.services__api__http__0 || 
      'http://localhost:5000'  // Fallback for local dev without Aspire
    ),
  },
})
