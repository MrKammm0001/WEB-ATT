# Quick Start Guide

## 🚀 Getting Started

### 1. Start the Server
```bash
node server.js
```
or
```bash
npm start
```

### 2. Open the Dashboard
Open your browser and navigate to:
```
http://localhost:3000/index.html
```

### 3. Configure Testing Parameters
- **Target URL**: Enter the URL to test (default: http://localhost:3000/target.html)
- **Delay**: Time between requests in seconds (default: 1)
- **Threads**: Number of concurrent threads (1-10, default: 1)
- **Max Requests**: Maximum number of requests to send (default: 100)

### 4. Start Testing
1. Click **▶️ Start Attack** to begin testing
2. Monitor real-time statistics in the dashboard
3. View request history in the logs panel
4. Click **⏹️ Stop Attack** to stop testing
5. Click **🔄 Reset Stats** to clear statistics

## 📊 Understanding the Dashboard

### Statistics Cards
- **Total Requests**: Total number of requests sent
- **Successful**: Number of successful requests (2xx status codes)
- **Failed**: Number of failed requests (errors or non-2xx codes)
- **Requests/sec**: Current request rate

### Performance Metrics
- **Average Response Time**: Mean response time across all requests
- **Fastest Response**: Minimum response time recorded
- **Slowest Response**: Maximum response time recorded
- **Success Rate**: Percentage of successful requests
- **Elapsed Time**: Total time since testing started
- **Active Threads**: Number of currently active request threads

### Request History
- Timestamped log entries
- Color-coded by status (green=success, red=error, blue=info)
- Auto-scrolls to latest entry
- Limited to 500 entries for performance

## 🎯 Testing Different Scenarios

### Test the Target Page
```
http://localhost:3000/target.html
```
A simple page that tracks visits and displays session information.

### Test API Endpoints

#### Normal Response
```
http://localhost:3000/api/status
```

#### Slow Response (2-5 seconds)
```
http://localhost:3000/api/slow
```

#### Random Error Codes
```
http://localhost:3000/api/error
```

#### Random Scenario
```
http://localhost:3000/api/random
```

#### Server Statistics
```
http://localhost:3000/api/stats
```

## 🐍 Using with Python Scripts

The existing Python scripts work alongside the web interface:

### Basic Request Script
```bash
python 進入網站-2.py
```

### Request Counter
```bash
python 加入進入請求次數.py
```

### Limited Requests
```bash
python 設置進入次數.py
```

## ⚠️ Important Notes

1. **Educational Use Only**: This tool is for learning and authorized testing only
2. **Permission Required**: Only test systems you own or have explicit permission to test
3. **Rate Limiting**: Be cautious with high request rates to avoid overloading servers
4. **CORS Restrictions**: External URLs may encounter CORS errors; use local endpoints for testing

## 🛠️ Troubleshooting

### Server won't start
- Ensure port 3000 is not in use
- Check that Node.js is installed (v12+)

### CORS errors when testing external URLs
- External servers may block cross-origin requests
- Use the local test endpoints instead
- Or run the Python scripts for external testing

### Dashboard not updating
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## 📝 Example Usage

1. Start server: `node server.js`
2. Open dashboard: `http://localhost:3000/index.html`
3. Set target: `http://localhost:3000/target.html`
4. Set delay: `1` second
5. Set threads: `2`
6. Set max requests: `50`
7. Click "Start Attack"
8. Watch real-time statistics update
9. Click "Stop Attack" when done
10. Review final statistics in the logs

Enjoy testing! 🎯
