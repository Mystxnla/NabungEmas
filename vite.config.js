import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vite untuk proyek GoldPath
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
