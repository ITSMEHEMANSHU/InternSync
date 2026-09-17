from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CompanyBrief(BaseModel):
    id: UUID
    name: str
    logo_url: str | None = None

    class Config:
        from_attributes = True


class InternshipBrief(BaseModel):
    id: UUID
    title: str
    location: str | None = None
    duration_months: int | None = None
    stipend: float | None = None
    remote: bool = False

    class Config:
        from_attributes = True


class StudentBrief(BaseModel):
    id: UUID
    name: str
    email: str

    class Config:
        from_attributes = True


class ApplicationOut(BaseModel):
    id: UUID
    student_id: UUID
    internship_id: UUID
    status: str
    stage: str | None
    cover_letter: str | None
    ai_match_score: float | None
    ai_match_reason: str | None
    applied_at: datetime
    reviewed_at: datetime | None
    rejection_reason: str | None
    internship: InternshipBrief | None = None
    company: CompanyBrief | None = None
    student: StudentBrief | None = None

    class Config:
        from_attributes = True


class ApplicationCreate(BaseModel):
    cover_letter: str | None = None


class RejectPayload(BaseModel):
    reason: str | None = None