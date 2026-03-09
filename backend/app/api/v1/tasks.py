from fastapi import APIRouter, Depends, Response, status

from app.api.deps import get_current_user, get_user_id
from app.models.enums import TaskPriority, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services.tasks import create_task, delete_task, get_task, list_tasks, update_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


def serialize_task(task: dict) -> TaskRead:
    return TaskRead(
        id=str(task["_id"]),
        title=task["title"],
        description=task.get("description"),
        status=TaskStatus(task["status"]),
        priority=TaskPriority(task["priority"]),
        category=task.get("category"),
        due_date=task.get("due_date"),
        created_at=task["created_at"],
        updated_at=task["updated_at"],
    )


@router.get("", response_model=list[TaskRead])
async def get_tasks(
    status_filter: TaskStatus | None = None,
    priority: TaskPriority | None = None,
    category: str | None = None,
    sort_by: str = "created_at",
    order: str = "asc",
    current_user: dict = Depends(get_current_user),
) -> list[TaskRead]:
    tasks = await list_tasks(
        user_id=get_user_id(current_user),
        status=status_filter,
        priority=priority,
        category=category,
        sort_by=sort_by,
        order=order,
    )
    return [serialize_task(task) for task in tasks]


@router.post("", response_model=TaskRead, status_code=201)
async def post_task(payload: TaskCreate, current_user: dict = Depends(get_current_user)) -> TaskRead:
    task = await create_task(get_user_id(current_user), payload)
    return serialize_task(task)


@router.get("/{task_id}", response_model=TaskRead)
async def get_task_by_id(task_id: str, current_user: dict = Depends(get_current_user)) -> TaskRead:
    task = await get_task(get_user_id(current_user), task_id)
    return serialize_task(task)


@router.put("/{task_id}", response_model=TaskRead)
async def put_task(task_id: str, payload: TaskUpdate, current_user: dict = Depends(get_current_user)) -> TaskRead:
    task = await update_task(get_user_id(current_user), task_id, payload, partial=False)
    return serialize_task(task)


@router.patch("/{task_id}", response_model=TaskRead)
async def patch_task(task_id: str, payload: TaskUpdate, current_user: dict = Depends(get_current_user)) -> TaskRead:
    task = await update_task(get_user_id(current_user), task_id, payload, partial=True)
    return serialize_task(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_task(task_id: str, current_user: dict = Depends(get_current_user)) -> Response:
    await delete_task(get_user_id(current_user), task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
