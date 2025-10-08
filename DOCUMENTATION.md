# Web Attack Testing Tool - Documentation

## Overview
A comprehensive web testing application that provides a professional dashboard for monitoring and controlling web request testing. This tool is designed for educational and authorized security testing purposes.

## Features

### 🎯 Main Dashboard (`index.html`)
- Real-time request statistics display
- Interactive control panel
- Performance metrics visualization
- Request history logging
- Response details monitoring

### 🎨 Modern UI (`styles.css`)
- Dark theme optimized for monitoring
- Responsive design (mobile-friendly)
- Interactive hover effects
- Status indicators with color coding
- Smooth animations and transitions

### ⚡ JavaScript Functionality (`script.js`)
- Real-time request monitoring
- Multi-threaded request simulation
- Dynamic statistics updates
- Request history tracking
- Error handling and logging
- Performance metrics calculation

### 🎯 Test Target Page (`target.html`)
- Simple test target for Python scripts
- Visit counter
- Session tracking
- Response time simulation
- Multiple endpoints for testing

### 🚀 Node.js Server (`server.js`)
- HTTP server for testing
- Request logging and statistics
- Rate limiting simulation
- Multiple response scenarios:
  - `/api/status` - Normal response
  - `/api/slow` - Slow response (2-5s)
  - `/api/error` - Random error codes
  - `/api/random` - Random scenarios
  - `/api/stats` - Server statistics

## Installation

### Prerequisites
- Node.js (v12 or higher)
- Modern web browser
- Python 3.x (for existing Python scripts)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/MrKammm0001/WEB-ATT.git
   cd WEB-ATT
   ```

2. No additional dependencies needed for Node.js server (uses built-in modules)

## Usage

### Starting the Server
```bash
node server.js
```

The server will start on `http://localhost:3000`

### Accessing the Dashboard
1. Open your browser and navigate to:
   ```
   http://localhost:3000/index.html
   ```

2. Configure test parameters:
   - **Target URL**: The URL to test (default: http://localhost:3000/target.html)
   - **Delay**: Time between requests in seconds
   - **Threads**: Number of concurrent request threads (1-10)
   - **Max Requests**: Maximum number of requests to send

3. Click "▶️ Start Attack" to begin testing

4. Monitor real-time statistics:
   - Total/Successful/Failed requests
   - Request rate (req/sec)
   - Response times (avg/min/max)
   - Success rate percentage
   - Elapsed time

5. Click "⏹️ Stop Attack" to stop the test

6. Click "🔄 Reset Stats" to clear statistics

### Testing with Python Scripts

The existing Python scripts can be used alongside the web interface:

#### Basic Request Script
```bash
python 進入網站-2.py
```

#### Request Counter Script
```bash
python 加入進入請求次數.py
```

#### Limited Requests Script
```bash
python 設置進入次數.py
```

## API Endpoints

### GET /api/status
Returns server status and uptime.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 12345,
  "message": "Server is running"
}
```

### GET /api/slow
Simulates a slow response (2-5 seconds delay).

### GET /api/error
Returns a random HTTP error code (400, 401, 403, 500, 502, 503).

### GET /api/random
Returns a random response scenario with varying status codes and delays.

### GET /api/stats
Returns detailed server statistics.

**Response:**
```json
{
  "totalRequests": 100,
  "successfulRequests": 95,
  "failedRequests": 5,
  "uptime": 60000,
  "requestRate": "1.67",
  "requestsByEndpoint": { ... }
}
```

## Features Explained

### Real-time Monitoring
- Live updates of request statistics
- Color-coded status indicators (green for success, red for errors)
- Request logs with timestamps
- Performance metrics tracking

### Control Panel
- Configurable test parameters
- Start/Stop/Reset controls
- Status indicator with animation
- Input validation

### Performance Metrics
- Average response time
- Fastest/slowest response times
- Success rate percentage
- Active threads count
- Elapsed time tracker

### Request History
- Timestamped log entries
- Color-coded by status (success/error/info)
- Auto-scroll to latest entry
- Clear logs functionality
- Limited to 500 entries for performance

### Latest Response Details
- HTTP status code
- Response time in milliseconds
- Content length
- Timestamp

## Security Notice

⚠️ **Warning**: This tool is for educational and authorized testing purposes only.

- Only test systems you own or have explicit permission to test
- Unauthorized testing may be illegal in your jurisdiction
- Always follow responsible disclosure practices
- Do not use for malicious purposes

## Browser Compatibility

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Opera (v76+)

## Troubleshooting

### CORS Errors
If testing external URLs, you may encounter CORS errors. The server includes CORS headers for local testing, but external servers may block cross-origin requests. Use the server's endpoints or test local resources.

### Connection Refused
Ensure the Node.js server is running before accessing the dashboard.

### High Request Rates
Be cautious with high thread counts and low delays, as this can overload the target server or your network connection.

## License

Use responsibly and ethically. This tool is provided for educational purposes.

## Contributing

Feel free to submit issues or pull requests to improve the tool.

---

注意事項 & Terminal :
- 確保網路正常
- 無需額外安裝Python任何程式
- Python Terminal輸出 : 進入次數: 1, Status Code: 200 = 成功進入網站
- Python Terminal輸出 : 進入次數: 1, Error: HTTPSConnectionPool... = 請求失敗
- Node.js 伺服器使用內建模組，無需安裝依賴
