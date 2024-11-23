# max_total_requests 最大進入次數

import requests
import time

url = "https://example.com"

max_retries = 5
retries = 0

max_total_requests = 3
total_requests = 0

while retries < max_retries and total_requests < max_total_requests:
    try:
        total_requests += 1
        
        response = requests.get(url)
        print(f"進入次數: {total_requests}, Status Code: {response.status_code}")
        
        retries = 0

        time.sleep(2)
    except requests.RequestException as e:
        total_requests += 1
        print(f"進入次數: {total_requests}, Error: {e}")
        
        retries += 1
        
        print(f"重試中... ({retries}/{max_retries})")
        time.sleep(5)

if total_requests >= max_total_requests:
    print(f"已達到最大進入次數限制 ({max_total_requests})，程式結束。")
elif retries >= max_retries:
    print(f"已達到最大重試次數限制 ({max_retries})，程式結束。")