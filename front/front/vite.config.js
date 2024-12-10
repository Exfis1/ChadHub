import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		extensions: ['.mjs', '.js', '.jsx', '.json'], // Ensure .js is included for resolution
	},
})
