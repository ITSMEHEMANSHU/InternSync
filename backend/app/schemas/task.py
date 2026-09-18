from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List
from app.schemas.application import StudentBrief


class TaskCreate(BaseModel):
    assignment_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str = "medium"
    assigned_intern_ids: Optional[List[UUID]] = None


class TaskStatusUpdate(BaseModel):
    status: str


class TaskLogCreate(BaseModel):
    log_text: str
    hours_spent: Optional[str] = None


class TaskLogOut(BaseModel):
    id: UUID
    task_id: UUID
    student_id: UUID
    log_text: str
    hours_spent: Optional[str] = None
    created_at: datetime
    student: Optional[StudentBrief] = None

    class Config:
        from_attributes = True


class TaskOut(BaseModel):
    id: UUID
    assignment_id: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: str
    priority: str
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    logs: Optional[List[TaskLogOut]] = []

    class Config:
        from_attributes = True
