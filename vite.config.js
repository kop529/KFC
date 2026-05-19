import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
  ],
  build: {
    // Target modern browsers — smaller polyfill budget
    target: 'es2020',
    // Increase chunk size limit (warn only above 1MB)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk strategy: split heavy libs into separate cacheable chunks
        manualChunks: (id) => {
          // Framer Motion — large, rarely changes
          if (id.includes('framer-motion')) return 'framer-motion';
          // Lucide icons — tree-shaken but still sizeable
          if (id.includes('lucide-react')) return 'lucide';
          // React core — always cached after first visit
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react-vendor';
          // React Router
          if (id.includes('react-router-dom') || id.includes('react-router')) return 'router';
          // Tanstack Query
          if (id.includes('@tanstack')) return 'query';
          // Radix UI components
          if (id.includes('@radix-ui')) return 'radix';
          // Sonner / toast
          if (id.includes('sonner')) return 'ui-utils';
        },
        // Content-hash filenames — long-lived cache
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Minification
    minify: 'esbuild',
    // Inline assets smaller than 4KB (saves a round-trip)
    assetsInlineLimit: 4096,
    // Separate CSS per chunk for better caching granularity
    cssCodeSplit: true,
  },
});