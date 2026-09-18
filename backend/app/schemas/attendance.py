from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional


class AttendanceMark(BaseModel):
    date: date
    status: str = "present"
    hours: float = 8.0
    notes: Optional[str] = None


class AttendanceOut(BaseModel):
    id: UUID
    assignment_id: UUID
    student_id: UUID
    date: date
    status: str
    hours: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
