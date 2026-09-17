from pydantic import BaseModel
from uuid import UUID
from datetime import date

class CompanyBrief(BaseModel):
    id: UUID
    name: str
    logo_url: str | None = None

    class Config:
        from_attributes = True

class InternshipOut(BaseModel):
    id: UUID
    title: str
    description: str | None
    required_skills: list[str] = []
    duration_months: int | None
    stipend: float | None
    location: str | None
    remote: bool
    openings: int
    status: str
    deadline: date | None
    company: CompanyBrief

    class Config:
        from_attributes = True