import path from 'path';
import checker from 'vite-plugin-checker';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            checker({
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
                },
            }),
        ],
        resolve: {
            alias: [
                {
                    find: /^~(.+)/,
                    replacement: path.join(process.cwd(), 'node_modules/$1'),
                },
                {
                    find: /^src(.+)/,
                    replacement: path.join(process.cwd(), 'src/$1'),
                },

            ],
        },
        server: {
            port: 3030,
            proxy: {
                // Proxy all API routes to the backend server
                '^/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                },
                // Proxy other routes directly
                '^/(auth|clinic|doctor|queue|queue-slot|doctor-absence|doctor-clinic)': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: true,
                    ws: true
                }
            },
        },
        preview: {
            port: 3030,
        },
    };
});
