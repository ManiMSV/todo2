from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.db.database import get_database
from app.db.object_id import parse_object_id
from app.models.enums import TaskPriority, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(user_id: str, payload: TaskCreate) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": parse_object_id(user_id),
        "title": payload.title,
        "description": payload.description,
        "status": TaskStatus.TODO.value,
        "priority": payload.priority.value,
        "category": payload.category,
        "due_date": payload.due_date,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.tasks.insert_one(doc)
    created = await db.tasks.find_one({"_id": result.inserted_id})
    return created or doc


async def list_tasks(
    user_id: str,
    status: TaskStatus | None = None,
    priority: TaskPriority | None = None,
    category: str | None = None,
    sort_by: str = "created_at",
    order: str = "asc",
) -> list[dict]:
    db = get_database()
    query: dict = {"user_id": parse_object_id(user_id)}

    if status is not None:
        query["status"] = status.value
    if priority is not None:
        query["priority"] = priority.value
    if category:
        query["category"] = category

    sort_fields = {"due_date", "created_at", "priority"}
    selected_sort = sort_by if sort_by in sort_fields else "created_at"
    sort_direction = 1 if order.lower() == "asc" else -1

    cursor = db.tasks.find(query).sort(selected_sort, sort_direction)
    return [task async for task in cursor]


async def get_task(user_id: str, task_id: str) -> dict:
    db = get_database()
    task = await db.tasks.find_one({
        "_id": parse_object_id(task_id),
        "user_id": parse_object_id(user_id),
    })
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


async def update_task(user_id: str, task_id: str, payload: TaskUpdate, partial: bool) -> dict:
    db = get_database()
    task = await get_task(user_id, task_id)
    updates = payload.model_dump(exclude_none=partial)

    if not partial and not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No task data provided",
        )

    if not partial:
        required = {"title", "description", "status", "priority", "category", "due_date"}
        for field in required:
            updates.setdefault(field, task.get(field))

    if "status" in updates and updates["status"] is not None:
        updates["status"] = updates["status"].value
    if "priority" in updates and updates["priority"] is not None:
        updates["priority"] = updates["priority"].value

    updates["updated_at"] = datetime.now(timezone.utc)
    await db.tasks.update_one(
        {"_id": task["_id"], "user_id": parse_object_id(user_id)},
        {"$set": updates},
    )
    return await get_task(user_id, task_id)


async def delete_task(user_id: str, task_id: str) -> None:
    db = get_database()
    result = await db.tasks.delete_one({
        "_id": parse_object_id(task_id),
        "user_id": parse_object_id(user_id),
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
