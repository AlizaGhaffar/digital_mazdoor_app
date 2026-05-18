import asyncio
import os
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

    model = OpenAIChatCompletionsModel(
        model="deepseek/deepseek-chat-v3-0324",
        openai_client=client
    )

    print("Success loading model")

asyncio.run(test())
