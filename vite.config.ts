import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Set VITE_BASE_URL to your GitHub Pages repo name, e.g. '/unsafe-framework-patterns/'
// Leave unset (defaults to '/') for local dev or custom domain deployment
const BASE = process.env.VITE_BASE_URL ?? '/'

export default defineConfig({
  base: BASE,
  plugins: [
    vue(),
    // Tailwind v4: CSS processing is handled by the Vite plugin directly,
    // no postcss.config.js or tailwind.config.js required.
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          shiki: ['shiki'],
          vendor: ['vue', 'vue-router', 'fuse.js'],
        },
      },
    },
  },
})
