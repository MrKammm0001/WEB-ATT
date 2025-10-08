// Web Attack Testing Tool - Main Script
class WebAttackTester {
    constructor() {
        // State
        this.isRunning = false;
        this.startTime = null;
        this.stats = {
            total: 0,
            successful: 0,
            failed: 0,
            responseTimes: []
        };
        this.workers = [];
        this.timerInterval = null;
        
        // DOM Elements
        this.elements = {
            totalRequests: document.getElementById('totalRequests'),
            successfulRequests: document.getElementById('successfulRequests'),
            failedRequests: document.getElementById('failedRequests'),
            requestRate: document.getElementById('requestRate'),
            avgResponseTime: document.getElementById('avgResponseTime'),
            fastestResponse: document.getElementById('fastestResponse'),
            slowestResponse: document.getElementById('slowestResponse'),
            successRate: document.getElementById('successRate'),
            elapsedTime: document.getElementById('elapsedTime'),
            activeThreads: document.getElementById('activeThreads'),
            lastStatusCode: document.getElementById('lastStatusCode'),
            lastResponseTime: document.getElementById('lastResponseTime'),
            lastContentLength: document.getElementById('lastContentLength'),
            lastTimestamp: document.getElementById('lastTimestamp'),
            logsContainer: document.getElementById('logsContainer'),
            statusText: document.getElementById('statusText'),
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            resetBtn: document.getElementById('resetBtn'),
            clearLogsBtn: document.getElementById('clearLogsBtn'),
            targetUrl: document.getElementById('targetUrl'),
            delay: document.getElementById('delay'),
            threads: document.getElementById('threads'),
            maxRequests: document.getElementById('maxRequests')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startAttack());
        this.elements.stopBtn.addEventListener('click', () => this.stopAttack());
        this.elements.resetBtn.addEventListener('click', () => this.resetStats());
        this.elements.clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }
    
    startAttack() {
        if (this.isRunning) return;
        
        const targetUrl = this.elements.targetUrl.value.trim();
        if (!targetUrl) {
            this.addLog('error', 'Please enter a target URL');
            return;
        }
        
        this.isRunning = true;
        this.startTime = new Date();
        this.elements.startBtn.disabled = true;
        this.elements.stopBtn.disabled = false;
        this.elements.statusText.textContent = 'Running';
        this.elements.statusText.classList.add('running');
        
        const threads = parseInt(this.elements.threads.value);
        const delay = parseFloat(this.elements.delay.value) * 1000;
        const maxRequests = parseInt(this.elements.maxRequests.value);
        
        this.addLog('info', `Starting attack on ${targetUrl} with ${threads} thread(s)`);
        this.addLog('info', `Configuration: ${delay}ms delay, max ${maxRequests} requests`);
        
        // Start worker threads
        for (let i = 0; i < threads; i++) {
            this.startWorker(i, delay, maxRequests);
        }
        
        // Start timer update
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }
    
    stopAttack() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.elements.startBtn.disabled = false;
        this.elements.stopBtn.disabled = true;
        this.elements.statusText.textContent = 'Stopped';
        this.elements.statusText.classList.remove('running');
        
        // Stop all workers
        this.workers.forEach(worker => clearTimeout(worker));
        this.workers = [];
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.addLog('info', 'Attack stopped by user');
        this.displayFinalStats();
    }
    
    async startWorker(threadId, delay, maxRequests) {
        while (this.isRunning && this.stats.total < maxRequests) {
            await this.makeRequest(threadId);
            await this.sleep(delay);
        }
        
        // Check if all workers are done
        if (this.stats.total >= maxRequests && this.isRunning) {
            this.stopAttack();
            this.addLog('success', `Reached maximum requests limit (${maxRequests})`);
        }
    }
    
    async makeRequest(threadId) {
        const targetUrl = this.elements.targetUrl.value.trim();
        const startTime = performance.now();
        
        try {
            const response = await fetch(targetUrl, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.stats.total++;
            this.stats.successful++;
            this.stats.responseTimes.push(responseTime);
            
            // Update latest response details
            const contentLength = response.headers.get('content-length') || 'unknown';
            this.updateLatestResponse(response.status, responseTime, contentLength);
            
            this.addLog('success', 
                `Request #${this.stats.total} | Status: ${response.status} | ` +
                `Time: ${responseTime.toFixed(2)}ms | Thread: ${threadId}`
            );
            
            this.updateStats();
            
        } catch (error) {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.stats.total++;
            this.stats.failed++;
            
            this.addLog('error', 
                `Request #${this.stats.total} | Error: ${error.message} | Thread: ${threadId}`
            );
            
            this.updateStats();
        }
    }
    
    updateLatestResponse(statusCode, responseTime, contentLength) {
        this.elements.lastStatusCode.textContent = statusCode;
        this.elements.lastResponseTime.textContent = `${responseTime.toFixed(2)} ms`;
        this.elements.lastContentLength.textContent = contentLength + ' bytes';
        this.elements.lastTimestamp.textContent = new Date().toLocaleTimeString();
        
        // Color code status
        const statusElement = this.elements.lastStatusCode;
        statusElement.style.color = statusCode >= 200 && statusCode < 300 ? 
            'var(--success-color)' : 'var(--error-color)';
    }
    
    updateStats() {
        // Update counters
        this.elements.totalRequests.textContent = this.stats.total;
        this.elements.successfulRequests.textContent = this.stats.successful;
        this.elements.failedRequests.textContent = this.stats.failed;
        
        // Calculate request rate
        if (this.startTime) {
            const elapsed = (new Date() - this.startTime) / 1000;
            const rate = elapsed > 0 ? (this.stats.total / elapsed).toFixed(2) : '0.00';
            this.elements.requestRate.textContent = rate;
        }
        
        // Calculate response time metrics
        if (this.stats.responseTimes.length > 0) {
            const avg = this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length;
            const min = Math.min(...this.stats.responseTimes);
            const max = Math.max(...this.stats.responseTimes);
            
            this.elements.avgResponseTime.textContent = `${avg.toFixed(2)} ms`;
            this.elements.fastestResponse.textContent = `${min.toFixed(2)} ms`;
            this.elements.slowestResponse.textContent = `${max.toFixed(2)} ms`;
        }
        
        // Calculate success rate
        const successRate = this.stats.total > 0 ? 
            ((this.stats.successful / this.stats.total) * 100).toFixed(2) : '0.00';
        this.elements.successRate.textContent = `${successRate}%`;
        
        // Update active threads
        this.elements.activeThreads.textContent = this.isRunning ? 
            this.elements.threads.value : '0';
    }
    
    updateTimer() {
        if (this.startTime) {
            const elapsed = new Date() - this.startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            this.elements.elapsedTime.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    
    displayFinalStats() {
        const elapsed = this.startTime ? (new Date() - this.startTime) / 1000 : 0;
        
        this.addLog('info', '=== Final Statistics ===');
        this.addLog('info', `Total Runtime: ${elapsed.toFixed(2)} seconds`);
        this.addLog('info', `Total Requests: ${this.stats.total}`);
        this.addLog('info', `Successful: ${this.stats.successful}`);
        this.addLog('info', `Failed: ${this.stats.failed}`);
        
        if (this.stats.total > 0) {
            const rate = (this.stats.total / elapsed).toFixed(2);
            const successRate = ((this.stats.successful / this.stats.total) * 100).toFixed(2);
            this.addLog('info', `Average Rate: ${rate} req/s`);
            this.addLog('info', `Success Rate: ${successRate}%`);
        }
    }
    
    resetStats() {
        if (this.isRunning) {
            this.stopAttack();
        }
        
        this.stats = {
            total: 0,
            successful: 0,
            failed: 0,
            responseTimes: []
        };
        
        this.startTime = null;
        
        // Reset all displays
        this.elements.totalRequests.textContent = '0';
        this.elements.successfulRequests.textContent = '0';
        this.elements.failedRequests.textContent = '0';
        this.elements.requestRate.textContent = '0.00';
        this.elements.avgResponseTime.textContent = '0 ms';
        this.elements.fastestResponse.textContent = '0 ms';
        this.elements.slowestResponse.textContent = '0 ms';
        this.elements.successRate.textContent = '0%';
        this.elements.elapsedTime.textContent = '00:00:00';
        this.elements.activeThreads.textContent = '0';
        this.elements.lastStatusCode.textContent = '-';
        this.elements.lastResponseTime.textContent = '-';
        this.elements.lastContentLength.textContent = '-';
        this.elements.lastTimestamp.textContent = '-';
        this.elements.statusText.textContent = 'Ready';
        this.elements.statusText.classList.remove('running');
        
        this.addLog('info', 'Statistics reset');
    }
    
    clearLogs() {
        this.elements.logsContainer.innerHTML = '';
        this.addLog('info', 'Logs cleared');
    }
    
    addLog(type, message) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const time = new Date().toLocaleTimeString();
        logEntry.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-message">${this.escapeHtml(message)}</span>
        `;
        
        this.elements.logsContainer.appendChild(logEntry);
        
        // Auto-scroll to bottom
        this.elements.logsContainer.scrollTop = this.elements.logsContainer.scrollHeight;
        
        // Limit log entries to 500
        const entries = this.elements.logsContainer.querySelectorAll('.log-entry');
        if (entries.length > 500) {
            entries[0].remove();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const tester = new WebAttackTester();
    console.log('Web Attack Testing Tool initialized');
});
