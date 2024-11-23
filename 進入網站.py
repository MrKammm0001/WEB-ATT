import requests
import time

url = "https://example.com"  # 替換為目標網站的 URL

while True:
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        # 模擬延遲，避免對伺服器造成過多壓力
        time.sleep(2)
    except requests.RequestException as e:
        print(f"Error: {e}")
        break  # 出現錯誤時停止迴圈
