import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import { fileURLToPath, dirname } from 'url'

import { readFileSync } from 'fs'

import { homedir } from 'os'
import type { AddressInfo } from 'net';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
    '@': fileURLToPath(dirname(fileURLToPath(import.meta.url)))
  }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
})
