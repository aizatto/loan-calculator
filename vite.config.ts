/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/loan-calculator/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    alias: {
      // react 17 has no package.json "exports" map, so node-style resolution
      // of the extensionless jsx-runtime import in ESM deps fails under
      // vitest. Drop these aliases with the react 19 upgrade.
      'react/jsx-runtime': 'react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
    },
    server: {
      deps: {
        // inline radix so the jsx-runtime aliases above apply to it
        inline: [/radix-ui/],
      },
    },
  },
})
