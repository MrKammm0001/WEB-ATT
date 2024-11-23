import aiohttp
import asyncio

url = "https://www.vtc.edu.hk/tc/home.html"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

async def fetch(session, url):
    for attempt in range(3):  # 最多重試 3 次
        try:
            async with session.get(url, headers=headers) as response:
                print(f"Status Code: {response.status}")
                content = await response.text()
                print(f"Content: {content[:100]}")  # 打印前 100 個字符
                return
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            await asyncio.sleep(1)
    print("All attempts failed.")

async def main():
    async with aiohttp.ClientSession() as session:
        for _ in range(3):  # 限制請求次數為 10 次
            await fetch(session, url)
            await asyncio.sleep(2)

asyncio.run(main())

