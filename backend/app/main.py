from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router

from app.data.seller_data import (
    seller_data,
    get_seller_insights
)

app = FastAPI(
    title="Snapdeal AI Virtual KAM",
    description="AI-powered Virtual Key Account Manager",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router,
    prefix="/api",
    tags=["AI Chat"]
)

@app.get("/")
def home():
    return {
        "message": "Snapdeal AI Virtual KAM API is running"
    }


@app.get("/api/seller/metrics")
def seller_metrics():
    return {
        "seller_data": seller_data,
        "insights": get_seller_insights()
    }