
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const app = express();
const PORT = process.env.PROXYPORT || 4454;




//if NODE_URL is empty, exit
if (!process.env.NODE_URL) {
    console.log('Please set NODE_URL which should enabled gateway, example: http://localhost:26659');
    process.exit(1);
}

app.use(cors(
    // {
    // origin: '*', // or your specific origin
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'node_url']
    // }
));

app.use('/submit_pfb', (req, res, next) => {
    let TARGET_SERVER
    if (!req.headers['node_url']) {
        TARGET_SERVER = process.env.NODE_URL
    }
    else {

        TARGET_SERVER =  req.headers['node_url'];
    }


    const proxy = createProxyMiddleware({

        target: TARGET_SERVER,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            return '/submit_pfb';
        },
        onProxyReq: (proxyReq) => {
            proxyReq.removeHeader('origin');
        },
        onProxyRes: (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, node_url';
        },
    });

    proxy(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
})