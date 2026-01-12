const http = require('http');
const fs = require('fs');
const path = require('path');

const Corroded = require('../lib/server');
const createUrlBlocker = require('../lib/server/url-blocker');

const urlBlocker = createUrlBlocker({
    statusCode: 403
});

const proxy = new Corroded({
    codec: 'xor',
    prefix: '/p/',
    forceHttps: false,
    ws: true,
    cookie: true,
    title: 'Corroded Page',
    requestMiddleware: [urlBlocker],
});

proxy.bundleScripts();

const server = http.createServer((request, response) => {
    // Handle proxy requests
    if (request.url.startsWith(proxy.prefix)) {
        return proxy.request(request, response);
    }

    // Serve images from ./img
    if (request.url.startsWith('/img/')) {
        const imgPath = path.join(__dirname, request.url);
        fs.readFile(imgPath, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('Image not found');
            }
            // Basic content-type detection
            const ext = path.extname(imgPath).toLowerCase();
            const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml'
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data);
        });
        return;
    }

    // Default: serve index.html
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
});

server.on('upgrade', (clientRequest, clientSocket, clientHead) => 
    proxy.upgrade(clientRequest, clientSocket, clientHead)
);

server.listen(process.env.PORT || 65440, () => {
    console.log(`HTTP server running on port ${process.env.PORT || 65440}`);
});
