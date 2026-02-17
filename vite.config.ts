import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aliasPath = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
  },
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\/(.*)$/,
        replacement: path.join(aliasPath, "$1").replace(/\\/g, "/"),
      },
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        getStarted: path.resolve(__dirname, 'get-started.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**', 'src/test/visual-regression/**'],
  },
});
