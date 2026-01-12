const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const server = http.createServer((request, response) => {
    // Handle bare server requests for Ultraviolet
    if (request.url.startsWith('/bare/')) {
        try {
            // Extract the target URL from the bare request
            const targetUrl = request.url.replace('/bare/', '');
            
            if (!targetUrl) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                response.end('Bad Request: No URL provided');
                return;
            }
            
            // Parse the target URL
            let parsedUrl;
            try {
                parsedUrl = new URL(targetUrl);
            } catch (e) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                response.end('Bad Request: Invalid URL');
                return;
            }
            
            // Choose the appropriate protocol
            const client = parsedUrl.protocol === 'https:' ? https : http;
            
            // Make the actual request to the target URL
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
                path: parsedUrl.pathname + parsedUrl.search,
                method: request.method,
                headers: {
                    ...request.headers,
                    host: parsedUrl.hostname
                }
            };
            
            // Remove problematic headers
            delete options.headers['host'];
            delete options.headers['connection'];
            delete options.headers['content-length'];
            
            const proxyReq = client.request(options, (proxyRes) => {
                // Copy response headers
                const headers = { ...proxyRes.headers };
                delete headers['content-encoding'];
                delete headers['content-length'];
                
                response.writeHead(proxyRes.statusCode, headers);
                proxyRes.pipe(response);
            });
            
            proxyReq.on('error', (err) => {
                console.error('Proxy request error:', err);
                if (!response.headersSent) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end('Proxy server error');
                }
            });
            
            // Pipe request body
            request.pipe(proxyReq);
            
        } catch (error) {
            console.error('Bare server error:', error);
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
