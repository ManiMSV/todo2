from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    category: str | None = Field(default=None, max_length=100)
    due_date: datetime | None = None


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    priority: TaskPriority = TaskPriority.MEDIUM
    category: str | None = Field(default=None, max_length=100)
    due_date: datetime | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    category: str | None = Field(default=None, max_length=100)
    due_date: datetime | None = None


class TaskRead(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime
