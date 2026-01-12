const http = require('http');
const fs = require('fs');
const path = require('path');
const { BareTransport } = require('@mercuryworkshop/bare-transport');

const server = http.createServer((request, response) => {
    
    // Create a new bare transport instance
    const bare = new BareTransport('/bare/');
    
    // Handle bare transport requests for Ultraviolet
    if (request.url.startsWith('/bare/')) {
        try {
            bare.handleRequest(request, response);
        } catch (error) {
            console.error('Bare transport error:', error);
            if (!response.headersSent) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Proxy server error');
            }
        }
        return;
    }

    // Serve UV bundle files
    if (request.url.startsWith('/uv/')) {
        const filePath = path.join(__dirname, request.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('File not found');
            }
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.end(data);
        });
        return;
    }

    // Serve service worker
    if (request.url === '/sw.js') {
        fs.readFile(path.join(__dirname, 'sw.js'), (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('Service worker not found');
            }
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.end(data);
        });
        return;
    }

    // Serve images from ./img
    if (request.url.startsWith('/img/')) {
        const imgPath = path.join(__dirname, request.url);
        fs.readFile(imgPath, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('Image not found');
            }
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

server.listen(process.env.PORT || 65440, () => {
    console.log(`HTTP server running on port ${process.env.PORT || 65440}`);
});

server.on('upgrade', (req, socket, head) => {
    // Create a new bare transport instance for this upgrade request
    const bare = new BareTransport('/bare/');
    
    if (req.url.startsWith('/bare/')) {
        try {
            bare.handleUpgrade(req, socket, head);
        } catch (error) {
            console.error('Bare transport upgrade error:', error);
            if (!socket.destroyed) {
                socket.end();
            }
        }
    } else {
        socket.end();
    }
});
