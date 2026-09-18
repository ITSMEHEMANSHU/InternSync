from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime


class CompanyBrief(BaseModel):
    id: UUID
    name: str
    logo_url: str | None = None

    class Config:
        from_attributes = True


class InternshipOut(BaseModel):
    id: UUID
    title: str
    description: str | None = None
    required_skills: list[str] = []
    duration_months: int | None = None
    stipend: float | None = None
    location: str | None = None
    remote: bool = False
    openings: int = 1
    status: str
    deadline: date | None = None
    start_date: date | None = None
    end_date: date | None = None
    approved_at: datetime | None = None
    rejection_reason: str | None = None
    company: CompanyBrief | None = None

    class Config:
        from_attributes = True


class InternshipCreate(BaseModel):
    title: str
    description: str | None = None
    required_skills: list[str] = []
    duration_months: int | None = None
    stipend: float | None = None
    location: str | None = None
    remote: bool = False
    openings: int = 1
    deadline: date | None = None
    start_date: date | None = None
    end_date: date | None = None


class InternshipUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: list[str] | None = None
    duration_months: int | None = None
    stipend: float | None = None
    location: str | None = None
    remote: bool | None = None
    openings: int | None = None
    deadline: date | None = None
    start_date: date | None = None
    end_date: date | None = None


class RejectPayload(BaseModel):
    reason: str | None = None