from datetime import datetime, timezone

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.core.security import get_password_hash, verify_password
from app.db.database import get_database
from app.schemas.auth import UserRegister


async def ensure_indexes() -> None:
    db = get_database()
    await db.users.create_index("email", unique=True)


async def create_user(payload: UserRegister) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = {
        "email": payload.email.lower(),
        "hashed_password": get_password_hash(payload.password),
        "full_name": payload.full_name,
        "created_at": now,
    }
    try:
        result = await db.users.insert_one(doc)
    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        ) from exc

    created = await db.users.find_one({"_id": result.inserted_id})
    return created or doc


async def get_user_by_email(email: str) -> dict | None:
    db = get_database()
    return await db.users.find_one({"email": email.lower()})


async def authenticate_user(email: str, password: str) -> dict:
    user = await get_user_by_email(email)
    if user is None or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
