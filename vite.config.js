import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), basicSsl()],
  optimizeDeps: {
    entries: ['index.html']
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    watch: {
      ignored: ['**/sdk_other/**']
    }
  }
});
