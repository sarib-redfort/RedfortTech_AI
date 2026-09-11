import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Resolve from this config's own directory, not process.cwd(), so the env is
  // found no matter which directory vite was invoked from.
  const env = loadEnv(mode, __dirname, '');
  // Where the NestJS backend is listening. Override with API_PORT / API_ORIGIN
  // in .env when port 5000 is taken.
  const apiOrigin =
    env.API_ORIGIN || `http://localhost:${env.API_PORT || 5000}`;

  return {
    plugins: [react(), tailwindcss()],
    build: {
      // Split the heavy, rarely-changing libraries into their own chunks so a
      // content change does not invalidate the whole vendor bundle in browser
      // caches. Pages are additionally code-split via React.lazy in App.tsx.
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-animation': ['gsap', 'motion', 'lenis', 'aos'],
          },
        },
      },
      chunkSizeWarningLimit: 700,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      proxy: {
        '/api/v1/public': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
