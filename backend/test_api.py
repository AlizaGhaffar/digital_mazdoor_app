import asyncio
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/v1/orchestrate",
            json={"prompt": "AC bilkul kaam nahi kar raha, kal morning chahiye DHA me"}
        )
        print(response.json())

asyncio.run(test())
