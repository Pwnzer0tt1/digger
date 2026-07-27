import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			"/api": process.env.BACKEND_URL || "http://localhost:8000"
		}
	}
});
