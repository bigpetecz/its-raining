import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '../../node_modules/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'component': path.resolve(__dirname, './src/component'),
      'config': path.resolve(__dirname, './src/config'),
      'state': path.resolve(__dirname, './src/state'),
      'type': path.resolve(__dirname, './src/type'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
