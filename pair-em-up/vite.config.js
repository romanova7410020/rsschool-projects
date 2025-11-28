import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: 'romanova7410020-JSFE2025Q3',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
});