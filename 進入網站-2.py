import requests
import time

url = "https://example.com"  # 替換為目標網站的 URL

while True:
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")

        time.sleep(2) # 模擬延遲
    except requests.RequestException as e:
        print(f"Error: {e}")
        # 5 秒後重試
        time.sleep(5)