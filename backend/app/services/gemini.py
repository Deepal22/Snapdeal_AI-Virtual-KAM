
import os
import time
import logging

from dotenv import load_dotenv
from groq import Groq

from app.prompts.system_prompt import SYSTEM_PROMPT

load_dotenv()

logger = logging.getLogger(__name__)

api_key = os.getenv("GROQ_API_KEY")
model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

if not api_key:
    raise RuntimeError("GROQ_API_KEY is missing from .env")

client = Groq(
    api_key=api_key,
    timeout=25.0,
    max_retries=0,
)


def _build_messages(message, history):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for item in history[-10:]:
        role = "assistant" if item["role"] == "model" else "user"
        messages.append({
            "role": role,
            "content": item["parts"][0]["text"]
        })

    messages.append({
        "role": "user",
        "content": message
    })

    return messages


def generate_response(message, history):
    start = time.perf_counter()

    print("Groq request starting...", flush=True)

    response = client.chat.completions.create(
        model=model_name,
        messages=_build_messages(message, history),
        temperature=0.3,
        max_completion_tokens=220,
    )

    elapsed = time.perf_counter() - start
    print(f"Groq response received in {elapsed:.2f}s", flush=True)

    reply = response.choices[0].message.content

    if not reply:
        raise RuntimeError("Groq returned an empty response")

    return reply


def stream_response(message, history):
    response = client.chat.completions.create(
        model=model_name,
        messages=_build_messages(message, history),
        temperature=0.3,
        max_completion_tokens=220,
        stream=True,
    )

    for chunk in response:
        text = chunk.choices[0].delta.content
        if text:
            yield text