import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true, // 포트가 사용 중이면 에러 발생
    host: true, // 네트워크 접근 허용
  },
})
