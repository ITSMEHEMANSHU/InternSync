from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List
from app.schemas.application import StudentBrief


class FeedbackOut(BaseModel):
    id: UUID
    weekly_report_id: UUID
    author_id: UUID
    comments: str
    rating: int = 8
    author_type: str = "company_mentor"
    created_at: datetime
    author: Optional[StudentBrief] = None

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    comments: str
    rating: int = 8


class WeeklyReportSave(BaseModel):
    week_number: int = 1
    summary: Optional[str] = None
    key_learnings: Optional[str] = None
    challenges: Optional[str] = None
    plan_next_week: Optional[str] = None
    hours_logged: int = 40


class WeeklyReportOut(BaseModel):
    id: UUID
    assignment_id: UUID
    student_id: UUID
    week_number: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    summary: Optional[str] = None
    key_learnings: Optional[str] = None
    challenges: Optional[str] = None
    plan_next_week: Optional[str] = None
    hours_logged: int = 40
    status: str
    ai_match_confidence: int = 95
    ai_audit_notes: Optional[str] = None
    submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    student: Optional[StudentBrief] = None
    feedback_entries: Optional[List[FeedbackOut]] = []

    class Config:
        from_attributes = True
