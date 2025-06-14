const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;
const apiBaseUrl = process.env.VITE_API_BASE_URL || 'https://management-service-ozfh.onrender.com';

// Serve static files
app.use(express.static('dist'));

// Proxy API requests
app.use(
    '/api',
    createProxyMiddleware({
        target: apiBaseUrl,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
            '^/api': '',
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Error');
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying:', req.method, req.url);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log('Received:', proxyRes.statusCode, req.url);
        },
    })
);

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
