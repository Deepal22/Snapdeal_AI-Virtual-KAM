import logging
from typing import Literal

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.services.gemini import generate_response, stream_response

router = APIRouter()
logger = logging.getLogger(__name__)


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    text: str = Field(min_length=1, max_length=3000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=3000)
    history: list[ChatMessage] = Field(default_factory=list)


def _history(request: ChatRequest):
    return [
        {"role": i.role, "parts": [{"text": i.text}]}
        for i in request.history[-20:]
    ]


@router.post("/chat")
def chat(request: ChatRequest):
    try:
        return {"reply": generate_response(request.message, _history(request))}
    except Exception as e:
        logger.exception("Gemini API error")
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")


@router.post("/chat/stream")
def chat_stream(request: ChatRequest):
    return StreamingResponse(
        stream_response(request.message, _history(request)),
        media_type="text/plain",
    )