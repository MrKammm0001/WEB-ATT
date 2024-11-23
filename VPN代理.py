import aiohttp
import asyncio

# 目標 URL
url = "https://www.vtc.edu.hk/tc/home.html"

# 自訂 User-Agent
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# 代理設定
proxies = {
    "http": "http://your_http_proxy_ip:port",  # 替換為你的 HTTP 代理
    "https": "http://your_https_proxy_ip:port",  # 替換為你的 HTTPS 代理
}


# 發送請求的函數
async def fetch(session, url, proxy=None):
    """
    發送 HTTP 請求，最多重試 3 次。
    :param session: aiohttp 客戶端會話
    :param url: 目標 URL
    :param proxy: 使用的代理（可選）
    """
    for attempt in range(10):  # 最多重試 3 次
        try:
            async with session.get(url, headers=headers, proxy=proxy) as response:
                print(f"Status Code: {response.status}")  # 打印狀態碼
                content = await response.text()
                print(f"Content: {content[:100]}")  # 打印前 100 個字符
                return
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            await asyncio.sleep(1)
    print("All attempts failed.")


# 主函數
async def main():
    """
    主函數，演示使用無代理和代理進行請求。
    """
    async with aiohttp.ClientSession() as session:
        # 無代理請求
        print("Fetching without proxy:")
        await fetch(session, url)

        # 使用 HTTP 代理請求
        print("\nFetching with HTTP proxy:")
        await fetch(session, url, proxy=proxies["http"])

        # 使用 HTTPS 代理請求
        print("\nFetching with HTTPS proxy:")
        await fetch(session, url, proxy=proxies["https"])


# 執行程式
asyncio.run(main())
