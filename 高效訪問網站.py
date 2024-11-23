import aiohttp
import asyncio

url = "https://example.com"  # <---替換為目標網站的 URL

async def fetch(session, url):
    try:
        async with session.get(url) as response:
            print(f"Status Code: {response.status}")
    except Exception as e:
        print(f"Error: {e}")

async def main():
    async with aiohttp.ClientSession() as session:
        while True:
            await fetch(session, url)
            await asyncio.sleep(2)  # 模擬延遲


asyncio.run(main())
