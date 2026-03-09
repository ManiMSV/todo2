from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.tasks import router as tasks_router
from app.core.config import settings
from app.db.database import close_mongo_connection, connect_to_mongo
from app.services.users import ensure_indexes

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await connect_to_mongo()
    await ensure_indexes()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_mongo_connection()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(tasks_router, prefix=settings.api_prefix)
