import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  
  // 3. 빌드 설정 및 청크 분리 전략
  build: {
    chunkSizeWarningLimit: 600, // 경고 표시 기준 상향 조정 (필요하다면)
    rollupOptions: {
      output: {
        manualChunks: {
          // 1. React 관련 라이브러리 분리
          'vendor-react': ['react', 'react-dom'],
          
          // 2. 마크다운 처리 관련 라이브러리 분리
          'vendor-markdown': ['marked', 'marked-highlight'],
          
          // 3. 코드 하이라이팅 라이브러리 분리
          'vendor-highlight': ['highlight.js'],
          
          // 4. Tauri 관련 라이브러리 분리
          'vendor-tauri': ['@tauri-apps/api', '@tauri-apps/plugin-opener']
        }
      }
    }
  }
}));
