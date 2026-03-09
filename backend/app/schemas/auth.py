from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=120)


class UserRead(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None
    created_at: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
