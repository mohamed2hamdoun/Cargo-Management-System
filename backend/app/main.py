from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import init_db
from app.api.v1 import api_router

app = FastAPI(title="Shipping Company API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix="/api/v1")
