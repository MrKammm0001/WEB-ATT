# WEB-ATT - Web Attack Testing Tool

## 🎯 Overview

A comprehensive web testing application with professional dashboard for monitoring and controlling web request testing. Designed for educational and authorized security testing purposes.

## ✨ Features

### Web Application (NEW!)
- **Interactive Dashboard** - Real-time monitoring with modern dark theme UI
- **Control Panel** - Configure and control testing parameters
- **Performance Metrics** - Track response times, success rates, and request rates
- **Request History** - Detailed logging with color-coded status
- **Node.js Server** - Built-in test server with multiple endpoints
- **Test Target Page** - Safe testing environment

### Python Scripts (Original)
- Basic web request scripts
- Request counter functionality
- Configurable request limits
- Error handling and retry logic

## 🚀 Quick Start

### Web Application
```bash
# Start the server
node server.js

# Open browser to http://localhost:3000/index.html
```

### Python Scripts
```bash
# Basic request script
python 進入網站-2.py

# Request counter
python 加入進入請求次數.py

# Limited requests
python 設置進入次數.py
```

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DOCUMENTATION.md](DOCUMENTATION.md) - Comprehensive documentation

## 注意事項 & Terminal

**Python Scripts:**
- 確保網路正常
- 無需額外安裝Python任何程式
- Python Terminal輸出 : 進入次數: 1, Status Code: 200 = 成功進入網站
- Python Terminal輸出 : 進入次數: 1, Error: HTTPSConnectionPool... = 請求失敗

**Web Application:**
- Node.js v12+ required
- No additional dependencies needed (uses built-in modules)
- Open http://localhost:3000/index.html after starting server

## ⚠️ Legal Notice

This tool is for **educational and authorized testing purposes only**. Unauthorized use may be illegal in your jurisdiction. Always obtain proper authorization before testing any systems.

## 📄 License

MIT License - Use responsibly and ethically.
