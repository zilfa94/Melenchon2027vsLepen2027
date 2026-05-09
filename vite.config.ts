import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: parseInt(process.env.PORT || '5173'),
    strictPort: false,
  },

  build: {
    // Inline assets < 4 KB
    assetsInlineLimit: 4096,
    // Source maps off in prod (ne pas exposer le code source)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Code splitting manuel — évite le bundle monolithique de 604 KB
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/recharts'))   return 'vendor-recharts'
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide'
        },
        // Nommage des chunks avec hash court
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8][extname]',
      },
    },
    // Lever la limite d'avertissement à 600 KB (recharts seul dépasse 500)
    chunkSizeWarningLimit: 600,
  },
})
