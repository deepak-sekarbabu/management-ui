import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiBaseUrl = env.VITE_API_BASE_URL || 'https://management-service-ozfh.onrender.com';

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
        define: {
            'process.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
        },
        server: {
            port: 3030,
            proxy: {
                '/api': {
                    target: apiBaseUrl,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('Sending Request to the Target:', req.method, req.url);
                        });
                        proxy.on('proxyRes', (proxyRes, req, _res) => {
                            console.log(
                                'Received Response from the Target:',
                                proxyRes.statusCode,
                                req.url
                            );
                        });
                    },
                },
            },
        },
        preview: {
            port: 3030,
            proxy: {
                '/api': {
                    target: apiBaseUrl,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});
