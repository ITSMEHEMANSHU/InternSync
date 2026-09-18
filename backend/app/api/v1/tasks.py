from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Task, TaskLog, Assignment, User, Company
from app.schemas.task import (
    TaskOut, TaskCreate, TaskStatusUpdate, TaskLogOut, TaskLogCreate,
)
from app.schemas.application import StudentBrief

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/my", response_model=list[TaskOut])
async def get_my_tasks(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    res_asms = await db.execute(
        select(Assignment.id).where(Assignment.student_id == uid)
    )
    asm_ids = res_asms.scalars().all()

    if not asm_ids:
        return []

    res_tasks = await db.execute(
        select(Task)
        .where(Task.assignment_id.in_(asm_ids))
        .order_by(Task.created_at.desc())
    )
    return res_tasks.scalars().all()


@router.post("", response_model=list[TaskOut], status_code=status.HTTP_201_CREATED)
async def create_tasks(
    payload: TaskCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    target_assignments = []
    if payload.assignment_id:
        res = await db.execute(select(Assignment).where(Assignment.id == payload.assignment_id))
        asm = res.scalar_one_or_none()
        if asm:
            target_assignments.append(asm)

    if payload.assigned_intern_ids and not target_assignments:
        res = await db.execute(
            select(Assignment).where(Assignment.student_id.in_(payload.assigned_intern_ids))
        )
        target_assignments = res.scalars().all()

    if not target_assignments:
        res_any = await db.execute(select(Assignment).limit(1))
        asm_any = res_any.scalar_one_or_none()
        if asm_any:
            target_assignments.append(asm_any)

    if not target_assignments:
        raise HTTPException(400, "No active intern assignments available to dispatch task.")

    created_tasks = []
    for asm in target_assignments:
        t = Task(
            assignment_id=asm.id,
            title=payload.title,
            description=payload.description,
            due_date=payload.due_date,
            priority=payload.priority or "medium",
            status="todo",
            created_by=uid,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(t)
        created_tasks.append(t)

    await db.commit()
    for t in created_tasks:
        await db.refresh(t)

    return created_tasks


@router.patch("/{task_id}/status", response_model=TaskOut)
async def update_task_status(
    task_id: UUID,
    payload: TaskStatusUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    res = await db.execute(select(Task).where(Task.id == task_id))
    t = res.scalar_one_or_none()
    if not t:
        raise HTTPException(404, "Task not found")

    t.status = payload.status
    t.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(t)
    return t


@router.post("/{task_id}/logs", response_model=TaskLogOut, status_code=status.HTTP_201_CREATED)
async def add_task_log(
    task_id: UUID,
    payload: TaskLogCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    res = await db.execute(select(Task).where(Task.id == task_id))
    t = res.scalar_one_or_none()
    if not t:
        raise HTTPException(404, "Task not found")

    log = TaskLog(
        task_id=t.id,
        student_id=uid,
        log_text=payload.log_text,
        hours_spent=payload.hours_spent,
        created_at=datetime.now(timezone.utc),
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)

    res_u = await db.execute(select(User).where(User.id == uid))
    u_obj = res_u.scalar_one_or_none()
    sb = StudentBrief(id=u_obj.id, name=u_obj.name, email=u_obj.email) if u_obj else None

    return TaskLogOut(
        id=log.id,
        task_id=log.task_id,
        student_id=log.student_id,
        log_text=log.log_text,
        hours_spent=log.hours_spent,
        created_at=log.created_at,
        student=sb,
    )


@router.get("/{task_id}/logs", response_model=list[TaskLogOut])
async def get_task_logs(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    res = await db.execute(
        select(TaskLog)
        .where(TaskLog.task_id == task_id)
        .order_by(TaskLog.created_at.desc())
    )
    logs = res.scalars().all()
    result = []
    for l in logs:
        res_u = await db.execute(select(User).where(User.id == l.student_id))
        u_obj = res_u.scalar_one_or_none()
        sb = StudentBrief(id=u_obj.id, name=u_obj.name, email=u_obj.email) if u_obj else None
        result.append(
            TaskLogOut(
                id=l.id,
                task_id=l.task_id,
                student_id=l.student_id,
                log_text=l.log_text,
                hours_spent=l.hours_spent,
                created_at=l.created_at,
                student=sb,
            )
        )
    return result
