from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional
from app.schemas.application import StudentBrief, InternshipBrief, CompanyBrief


class AssignmentCreate(BaseModel):
    application_id: UUID
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class JoiningUpdate(BaseModel):
    joining_date: date
    joining_letter_url: Optional[str] = None


class AssignmentOut(BaseModel):
    id: UUID
    application_id: UUID
    student_id: UUID
    company_id: UUID
    internship_id: UUID
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    joining_date: Optional[date] = None
    joining_letter_url: Optional[str] = None
    company_mentor_id: Optional[UUID] = None
    faculty_mentor_id: Optional[UUID] = None
    joining_verified_company: bool = False
    joining_verified_faculty: bool = False
    created_at: datetime
    updated_at: datetime

    student: Optional[StudentBrief] = None
    internship: Optional[InternshipBrief] = None
    company: Optional[CompanyBrief] = None

    class Config:
        from_attributes = True
