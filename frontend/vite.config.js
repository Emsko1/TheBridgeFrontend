import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5086',
                changeOrigin: true,
                secure: false,
            },
            '/images': {
                target: 'http://localhost:5086',
                changeOrigin: true,
                secure: false,
            },
            '/hub': {
                target: 'http://localhost:5086',
                changeOrigin: true,
                secure: false,
                ws: true
            }
        }
    }
})
