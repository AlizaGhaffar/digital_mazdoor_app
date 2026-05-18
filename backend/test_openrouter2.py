import asyncio
import os
import json
from dotenv import load_dotenv

from agents import (
    Agent,
    Runner,
    AsyncOpenAI,
    OpenAIChatCompletionsModel
)
from agents.run import RunConfig

load_dotenv()

async def test():
    client = AsyncOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1"
    )

    response = await client.chat.completions.create(
        model="deepseek/deepseek-chat-v3-0324",
        messages=[{"role": "user", "content": "Hello in JSON"}],
        response_format={"type": "json_object"}
    )
    print(response.choices[0].message.content)

asyncio.run(test())
