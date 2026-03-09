from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_current_user
from app.core.security import create_access_token
from app.schemas.auth import Token, UserRead, UserRegister
from app.services.users import authenticate_user, create_user

router = APIRouter(prefix="/auth", tags=["auth"])


def serialize_user(user: dict) -> UserRead:
    return UserRead(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user.get("full_name"),
        created_at=user["created_at"].isoformat(),
    )


@router.post("/register", response_model=UserRead, status_code=201)
async def register(payload: UserRegister) -> UserRead:
    user = await create_user(payload)
    return serialize_user(user)


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = await authenticate_user(form_data.username, form_data.password)
    token = create_access_token(user["email"])
    return Token(access_token=token)


@router.get("/me", response_model=UserRead)
async def me(current_user: dict = Depends(get_current_user)) -> UserRead:
    return serialize_user(current_user)
