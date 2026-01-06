import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { writeFileSync, existsSync } from "fs";
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aliasPath = path.resolve(__dirname, "src");
const buttonPath = path.resolve(aliasPath, "components", "ui", "button.tsx");

// #region agent log
const normalizedAlias = aliasPath.replace(/\\/g, "/");
const logData = {
  location: 'vite.config.ts:12',
  message: 'Vite config alias resolution',
  data: {
    __dirname,
    aliasPath,
    normalizedAlias,
    buttonPath,
    buttonExists: existsSync(buttonPath),
    srcExists: existsSync(aliasPath),
    finalAliasValue: normalizedAlias
  },
  timestamp: Date.now(),
  sessionId: 'debug-session',
  runId: 'run1',
  hypothesisId: 'A'
};
try {
  writeFileSync('.cursor/debug.log', JSON.stringify(logData) + '\n', { flag: 'a' });
} catch (e) {}
console.log('[DEBUG] Vite alias config:', logData.data);
// #endregion

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
  },
});
