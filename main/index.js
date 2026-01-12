const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((request, response) => {
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
