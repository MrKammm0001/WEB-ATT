// Simple Node.js Server for Web Attack Testing
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = 3000;
const HOST = 'localhost';

// Statistics tracking
let stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    requestsByEndpoint: {},
    startTime: new Date()
};

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Helper function to get MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// Helper function to log requests
function logRequest(method, requestUrl, statusCode, responseTime) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} ${requestUrl} - ${statusCode} (${responseTime}ms)`;
    console.log(logMessage);
    
    // Update statistics
    stats.totalRequests++;
    if (statusCode >= 200 && statusCode < 400) {
        stats.successfulRequests++;
    } else {
        stats.failedRequests++;
    }
    
    // Track by endpoint
    if (!stats.requestsByEndpoint[requestUrl]) {
        stats.requestsByEndpoint[requestUrl] = 0;
    }
    stats.requestsByEndpoint[requestUrl]++;
}

// Create server
const server = http.createServer((req, res) => {
    const startTime = Date.now();
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS for CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API endpoints
    if (pathname.startsWith('/api/')) {
        handleApiRequest(pathname, req, res, startTime);
        return;
    }
    
    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    // Security: prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        logRequest(req.method, pathname, 403, Date.now() - startTime);
        return;
    }
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The requested resource was not found.</p>');
                logRequest(req.method, pathname, 404, Date.now() - startTime);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                logRequest(req.method, pathname, 500, Date.now() - startTime);
            }
        } else {
            const mimeType = getMimeType(filePath);
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
            logRequest(req.method, pathname, 200, Date.now() - startTime);
        }
    });
});

// Handle API requests
function handleApiRequest(pathname, req, res, startTime) {
    switch (pathname) {
        case '/api/status':
            handleStatusRequest(req, res, startTime);
            break;
        case '/api/slow':
            handleSlowRequest(req, res, startTime);
            break;
        case '/api/error':
            handleErrorRequest(req, res, startTime);
            break;
        case '/api/random':
            handleRandomRequest(req, res, startTime);
            break;
        case '/api/stats':
            handleStatsRequest(req, res, startTime);
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
            logRequest(req.method, pathname, 404, Date.now() - startTime);
    }
}

// Status endpoint
function handleStatusRequest(req, res, startTime) {
    const response = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - stats.startTime.getTime(),
        message: 'Server is running'
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
    logRequest(req.method, '/api/status', 200, Date.now() - startTime);
}

// Slow response endpoint (simulates slow server)
function handleSlowRequest(req, res, startTime) {
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    
    setTimeout(() => {
        const response = {
            status: 'ok',
            message: 'Slow response completed',
            delay: delay
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        logRequest(req.method, '/api/slow', 200, Date.now() - startTime);
    }, delay);
}

// Error endpoint (simulates server error)
function handleErrorRequest(req, res, startTime) {
    const errorCodes = [400, 401, 403, 500, 502, 503];
    const statusCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
    
    const response = {
        error: 'Simulated error',
        code: statusCode,
        message: 'This is a test error response'
    };
    
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
    logRequest(req.method, '/api/error', statusCode, Date.now() - startTime);
}

// Random endpoint (random response scenario)
function handleRandomRequest(req, res, startTime) {
    const scenarios = [
        { code: 200, delay: 100 },
        { code: 200, delay: 500 },
        { code: 404, delay: 50 },
        { code: 500, delay: 200 },
        { code: 503, delay: 1000 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    setTimeout(() => {
        const response = {
            status: scenario.code,
            message: 'Random scenario response',
            delay: scenario.delay
        };
        
        res.writeHead(scenario.code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        logRequest(req.method, '/api/random', scenario.code, Date.now() - startTime);
    }, scenario.delay);
}

// Statistics endpoint
function handleStatsRequest(req, res, startTime) {
    const uptime = Date.now() - stats.startTime.getTime();
    const requestRate = stats.totalRequests / (uptime / 1000);
    
    const response = {
        totalRequests: stats.totalRequests,
        successfulRequests: stats.successfulRequests,
        failedRequests: stats.failedRequests,
        uptime: uptime,
        requestRate: requestRate.toFixed(2),
        requestsByEndpoint: stats.requestsByEndpoint,
        startTime: stats.startTime.toISOString()
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
    logRequest(req.method, '/api/stats', 200, Date.now() - startTime);
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('='.repeat(60));
    console.log('🚀 Web Attack Testing Server');
    console.log('='.repeat(60));
    console.log(`Server running at http://${HOST}:${PORT}/`);
    console.log(`Dashboard: http://${HOST}:${PORT}/index.html`);
    console.log(`Target Page: http://${HOST}:${PORT}/target.html`);
    console.log('='.repeat(60));
    console.log('Available API Endpoints:');
    console.log('  - /api/status   - Server status');
    console.log('  - /api/slow     - Slow response (2-5s)');
    console.log('  - /api/error    - Random error');
    console.log('  - /api/random   - Random scenario');
    console.log('  - /api/stats    - Server statistics');
    console.log('='.repeat(60));
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 Final Statistics');
    console.log('='.repeat(60));
    console.log(`Total Requests: ${stats.totalRequests}`);
    console.log(`Successful: ${stats.successfulRequests}`);
    console.log(`Failed: ${stats.failedRequests}`);
    console.log(`Uptime: ${Math.floor((Date.now() - stats.startTime.getTime()) / 1000)}s`);
    console.log('='.repeat(60));
    console.log('Server stopped. Goodbye!');
    process.exit(0);
});
