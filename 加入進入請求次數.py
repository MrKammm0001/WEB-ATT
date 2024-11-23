#total_requests 紀錄進入的總請求次數 
#每次迴圈進入+1 記錄總請求次數
#異常也算進入一次

import requests
import time

url = "https://example.com"

# 最大重試次數
max_retries = 5
retries = 0
total_requests = 0

while retries < max_retries:
    try:
        total_requests += 1
        
        response = requests.get(url)
        print(f"進入次數: {total_requests}, Status Code: {response.status_code}")
        
        retries = 0

        time.sleep(2)
    except requests.RequestException as e:
        total_requests += 1
        print(f"進入次數: {total_requests}, Error: {e}")
        
        # 增加重試計數器
        retries += 1
        
        # 等待 5 秒後重試
        print(f"重試中... ({retries}/{max_retries})")
        time.sleep(5)

print(f"已達到最大重試次數，程式結束。總進入次數: {total_requests}")