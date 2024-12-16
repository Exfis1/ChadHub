import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [react()],
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.json'],
    },
    build: {
        outDir: 'build', // Change output directory to 'build'
        rollupOptions: {
            external: ['react-router-dom'], // Externalize dependency if needed
        },
    },
});