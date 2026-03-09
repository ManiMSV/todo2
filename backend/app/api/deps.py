from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.db.object_id import parse_object_id
from app.services.users import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_prefix}/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email = payload.get("sub")
        if email is None:
            raise auth_error
    except JWTError as exc:
        raise auth_error from exc

    user = await get_user_by_email(email)
    if user is None:
        raise auth_error

    return user


def get_user_id(user: dict) -> str:
    return str(parse_object_id(str(user["_id"])))
