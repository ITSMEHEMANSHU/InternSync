from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Assignment, Application, User, Company, Internship
from app.schemas.assignment import (
    AssignmentOut, AssignmentCreate, JoiningUpdate,
)
from app.schemas.application import StudentBrief, InternshipBrief, CompanyBrief

router = APIRouter(prefix="/assignments", tags=["assignments"])


async def _enrich_assignment(db: AsyncSession, asm: Assignment) -> AssignmentOut:
    # Fetch Student
    res_s = await db.execute(select(User).where(User.id == asm.student_id))
    s_user = res_s.scalar_one_or_none()
    student_brief = (
        StudentBrief(id=s_user.id, name=s_user.name, email=s_user.email)
        if s_user
        else StudentBrief(id=asm.student_id, name="Student Candidate", email="student@internsync.com")
    )

    # Fetch Internship
    res_i = await db.execute(select(Internship).where(Internship.id == asm.internship_id))
    i_obj = res_i.scalar_one_or_none()
    internship_brief = (
        InternshipBrief(
            id=i_obj.id,
            title=i_obj.title,
            location=i_obj.location,
            duration_months=i_obj.duration_months,
            stipend=float(i_obj.stipend) if i_obj.stipend else None,
            remote=i_obj.remote,
        )
        if i_obj
        else None
    )

    # Fetch Company
    res_c = await db.execute(select(Company).where(Company.id == asm.company_id))
    c_obj = res_c.scalar_one_or_none()
    company_brief = (
        CompanyBrief(
            id=c_obj.id,
            name=c_obj.name,
            logo=c_obj.logo,
            website=c_obj.website,
            location=c_obj.location,
            verified=c_obj.verified,
        )
        if c_obj
        else None
    )

    return AssignmentOut(
        id=asm.id,
        application_id=asm.application_id,
        student_id=asm.student_id,
        company_id=asm.company_id,
        internship_id=asm.internship_id,
        status=str(asm.status),
        start_date=asm.start_date,
        end_date=asm.end_date,
        joining_date=asm.joining_date,
        joining_letter_url=asm.joining_letter_url,
        company_mentor_id=asm.company_mentor_id,
        faculty_mentor_id=asm.faculty_mentor_id,
        joining_verified_company=asm.joining_verified_company,
        joining_verified_faculty=asm.joining_verified_faculty,
        created_at=asm.created_at,
        updated_at=asm.updated_at,
        student=student_brief,
        internship=internship_brief,
        company=company_brief,
    )


@router.post("", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    payload: AssignmentCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    res_app = await db.execute(select(Application).where(Application.id == payload.application_id))
    app_obj = res_app.scalar_one_or_none()
    if not app_obj:
        raise HTTPException(404, "Application not found")

    res_int = await db.execute(select(Internship).where(Internship.id == app_obj.internship_id))
    int_obj = res_int.scalar_one_or_none()
    if not int_obj:
        raise HTTPException(404, "Internship not found")

    # Check if assignment already exists
    res_existing = await db.execute(
        select(Assignment).where(Assignment.application_id == payload.application_id)
    )
    existing = res_existing.scalar_one_or_none()
    if existing:
        return await _enrich_assignment(db, existing)

    new_asm = Assignment(
        application_id=app_obj.id,
        student_id=app_obj.student_id,
        company_id=int_obj.company_id,
        internship_id=int_obj.id,
        status="pending_joining",
        start_date=payload.start_date or int_obj.start_date,
        end_date=payload.end_date or int_obj.end_date,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_asm)
    await db.commit()
    await db.refresh(new_asm)
    return await _enrich_assignment(db, new_asm)


@router.get("/my", response_model=list[AssignmentOut])
async def get_my_assignments(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    res = await db.execute(
        select(Assignment)
        .where(Assignment.student_id == uid)
        .order_by(Assignment.created_at.desc())
    )
    asms = res.scalars().all()
    return [await _enrich_assignment(db, a) for a in asms]


@router.get("/company", response_model=list[AssignmentOut])
async def get_company_assignments(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    # Get company ID
    res_comp = await db.execute(
        select(Company).where(
            (Company.hr_spoc_user_id == uid) | (Company.user_id == uid)
        )
    )
    comp = res_comp.scalar_one_or_none()
    if not comp:
        res_comp_any = await db.execute(select(Company).limit(1))
        comp = res_comp_any.scalar_one_or_none()

    if not comp:
        return []

    res = await db.execute(
        select(Assignment)
        .where(Assignment.company_id == comp.id)
        .order_by(Assignment.created_at.desc())
    )
    asms = res.scalars().all()
    return [await _enrich_assignment(db, a) for a in asms]


@router.get("/faculty", response_model=list[AssignmentOut])
async def get_faculty_assignments(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty")),
):
    res = await db.execute(
        select(Assignment).order_by(Assignment.created_at.desc())
    )
    asms = res.scalars().all()
    return [await _enrich_assignment(db, a) for a in asms]


@router.post("/{assignment_id}/join", response_model=AssignmentOut)
async def record_joining(
    assignment_id: UUID,
    payload: JoiningUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    res = await db.execute(select(Assignment).where(Assignment.id == assignment_id))
    asm = res.scalar_one_or_none()
    if not asm:
        raise HTTPException(404, "Assignment not found")

    asm.joining_date = payload.joining_date
    if payload.joining_letter_url:
        asm.joining_letter_url = payload.joining_letter_url
    asm.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(asm)
    return await _enrich_assignment(db, asm)


@router.post("/{assignment_id}/verify-company", response_model=AssignmentOut)
async def verify_joining_company(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    res = await db.execute(select(Assignment).where(Assignment.id == assignment_id))
    asm = res.scalar_one_or_none()
    if not asm:
        raise HTTPException(404, "Assignment not found")

    asm.joining_verified_company = True
    asm.status = "active"
    asm.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(asm)
    return await _enrich_assignment(db, asm)


@router.post("/{assignment_id}/verify-faculty", response_model=AssignmentOut)
async def verify_joining_faculty(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty")),
):
    res = await db.execute(select(Assignment).where(Assignment.id == assignment_id))
    asm = res.scalar_one_or_none()
    if not asm:
        raise HTTPException(404, "Assignment not found")

    asm.joining_verified_faculty = True
    asm.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(asm)
    return await _enrich_assignment(db, asm)


@router.post("/{assignment_id}/complete", response_model=AssignmentOut)
async def complete_assignment(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    res = await db.execute(select(Assignment).where(Assignment.id == assignment_id))
    asm = res.scalar_one_or_none()
    if not asm:
        raise HTTPException(404, "Assignment not found")

    asm.status = "completed"
    asm.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(asm)
    return await _enrich_assignment(db, asm)
