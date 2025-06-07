import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const VITE_API_BASE_URL = env.VITE_API_BASE_URL;

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
                '/api': {
                    target: VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        preview: {
            port: 3030,
        },
    };
});
