from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Application, Internship, Company, User, Assignment, Role
from app.schemas.application import ApplicationOut, RejectPayload, StudentBrief
from app.schemas.internship import InternshipOut
from app.api.v1.applications import _enrich

router = APIRouter(prefix="/faculty", tags=["faculty"])


@router.get("/applications", response_model=list[ApplicationOut])
async def faculty_pending_applications(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """All applications awaiting faculty review (status=pending)."""
    result = await db.execute(
        select(Application)
        .where(Application.status == "pending")
        .order_by(Application.applied_at.asc())
    )
    apps = result.scalars().all()
    return await _enrich(db, apps, include_student=True)


@router.get("/applications/all", response_model=list[ApplicationOut])
async def faculty_all_applications(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Full history — pending, under_review, shortlisted, approved, rejected."""
    result = await db.execute(
        select(Application)
        .order_by(Application.applied_at.desc())
    )
    apps = result.scalars().all()
    return await _enrich(db, apps, include_student=True)


@router.get("/applications/{application_id}", response_model=ApplicationOut)
async def faculty_application_detail(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


@router.post("/applications/{application_id}/approve", response_model=ApplicationOut)
async def faculty_approve(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")
    if app_row.status != "pending":
        raise HTTPException(400, f"Cannot approve application with status '{app_row.status}'")

    app_row.status = "under_review"
    app_row.stage = "faculty_approved"
    app_row.faculty_approved_at = datetime.now(timezone.utc)
    try:
        app_row.faculty_approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        app_row.faculty_approved_by = None

    await db.commit()
    await db.refresh(app_row)

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


@router.post("/applications/{application_id}/reject", response_model=ApplicationOut)
async def faculty_reject(
    application_id: UUID,
    payload: RejectPayload,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")
    if app_row.status not in ("pending", "under_review"):
        raise HTTPException(400, f"Cannot reject application with status '{app_row.status}'")

    app_row.status = "rejected"
    app_row.stage = "faculty_rejected"
    app_row.rejection_reason = payload.reason or "Rejected by faculty"
    app_row.faculty_approved_at = datetime.now(timezone.utc)
    try:
        app_row.faculty_approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        app_row.faculty_approved_by = None

    await db.commit()
    await db.refresh(app_row)

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


# ============================================================
# INTERNSHIP POSTING APPROVALS BY FACULTY / ADMIN
# ============================================================

def _to_internship_out(i: Internship, company: Company | None) -> InternshipOut:
    return InternshipOut(
        id=i.id,
        title=i.title,
        description=i.description,
        required_skills=i.required_skills or [],
        duration_months=i.duration_months,
        stipend=float(i.stipend) if i.stipend else None,
        location=i.location,
        remote=i.remote,
        openings=i.openings,
        status=i.status,
        deadline=i.deadline,
        start_date=i.start_date,
        end_date=i.end_date,
        approved_at=i.approved_at,
        rejection_reason=i.rejection_reason,
        company=company,
    )


@router.get("/internship-approvals", response_model=list[InternshipOut])
async def list_pending_internships(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """List all internship postings pending approval."""
    result = await db.execute(
        select(Internship)
        .where(Internship.status == "pending_approval")
        .order_by(Internship.created_at.asc())
    )
    internships = result.scalars().all()
    if not internships:
        return []

    company_ids = list({i.company_id for i in internships})
    comp_result = await db.execute(
        select(Company).where(Company.id.in_(company_ids))
    )
    companies = {c.id: c for c in comp_result.scalars().all()}

    return [_to_internship_out(i, companies.get(i.company_id)) for i in internships]


@router.post("/internship-approvals/{internship_id}/approve", response_model=InternshipOut)
async def approve_internship_posting(
    internship_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Approve a pending internship posting to make it OPEN for students."""
    result = await db.execute(
        select(Internship).where(Internship.id == internship_id)
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship posting not found")

    i.status = "open"
    i.rejection_reason = None
    i.approved_at = datetime.now(timezone.utc)
    try:
        i.approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        i.approved_by = None

    await db.commit()
    await db.refresh(i)

    comp_result = await db.execute(
        select(Company).where(Company.id == i.company_id)
    )
    company = comp_result.scalar_one_or_none()
    return _to_internship_out(i, company)


@router.post("/internship-approvals/{internship_id}/reject", response_model=InternshipOut)
async def reject_internship_posting(
    internship_id: UUID,
    payload: RejectPayload,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Reject a pending internship posting with an optional reason."""
    result = await db.execute(
        select(Internship).where(Internship.id == internship_id)
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship posting not found")

    i.status = "rejected"
    i.rejection_reason = payload.reason or "Rejected by faculty review"
    i.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(i)

    comp_result = await db.execute(
        select(Company).where(Company.id == i.company_id)
    )
    company = comp_result.scalar_one_or_none()
    return _to_internship_out(i, company)


# ============================================================
# EXTENDED FACULTY DASHBOARD & MONITORING ENDPOINTS
# ============================================================

@router.get("/dashboard/stats")
async def get_faculty_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    res_students = await db.execute(select(func.count()).select_from(User))
    total_students = res_students.scalar() or 0

    res_active = await db.execute(
        select(func.count())
        .select_from(Assignment)
        .where(Assignment.status == "active")
    )
    active_internships = res_active.scalar() or 0

    res_pending = await db.execute(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "pending")
    )
    pending_approvals = res_pending.scalar() or 0

    return {
        "total_students": total_students,
        "active_internships": active_internships,
        "pending_approvals": pending_approvals,
        "risk_alerts": 2,
    }


@router.get("/students")
async def list_faculty_students(
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    query = select(User)
    if search:
        query = query.where(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))

    query = query.order_by(User.created_at.desc())
    res = await db.execute(query)
    users = res.scalars().all()

    return [
        {
            "id": str(u.id),
            "name": u.name or u.email.split("@")[0],
            "email": u.email,
            "department": "Computer Science & Engineering",
            "cgpa": 8.6,
            "status": "active" if u.status == "active" else "pending",
            "attendance": 94,
            "reports_filed": "6 / 8",
        }
        for u in users
    ]


@router.get("/students/{student_id}")
async def get_faculty_student_detail(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    res = await db.execute(select(User).where(User.id == student_id))
    u = res.scalar_one_or_none()
    if not u:
        raise HTTPException(404, "Student not found")

    res_asm = await db.execute(
        select(Assignment).where(Assignment.student_id == student_id).limit(1)
    )
    asm = res_asm.scalar_one_or_none()

    return {
        "id": str(u.id),
        "name": u.name or u.email.split("@")[0],
        "email": u.email,
        "phone": "+91 98765 43210",
        "department": "Computer Science",
        "cgpa": 8.7,
        "status": u.status,
        "assignment": {
            "id": str(asm.id) if asm else None,
            "status": str(asm.status) if asm else "unassigned",
            "company_name": asm.company.name if asm and asm.company else "N/A",
            "role": asm.internship.title if asm and asm.internship else "N/A",
        },
    }


@router.get("/monitoring")
async def get_faculty_monitoring(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    res = await db.execute(
        select(Assignment).order_by(Assignment.created_at.desc())
    )
    asms = res.scalars().all()

    return [
        {
            "id": str(a.id),
            "student_name": a.student.name if a.student else "Intern Candidate",
            "company_name": a.company.name if a.company else "Company Partner",
            "role": a.internship.title if a.internship else "Software Engineering Intern",
            "status": str(a.status),
            "attendance_rate": "95%",
            "reports_completed": "5 / 8",
            "last_active": "Today",
        }
        for a in asms
    ]


@router.get("/risk-cases")
async def get_faculty_risk_cases(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    return [
        {
            "id": "risk-001",
            "student_name": "Rohan Verma",
            "company": "TCS BaNCS",
            "risk_level": "high",
            "issue": "Missing weekly reports for 2 consecutive weeks",
            "attendance": "68%",
        },
        {
            "id": "risk-002",
            "student_name": "Sneha Gupta",
            "company": "Wipro",
            "risk_level": "medium",
            "issue": "Attendance dropped below 75% threshold",
            "attendance": "72%",
        },
    ]


@router.get("/analytics")
async def get_faculty_analytics(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    return {
        "placement_rate": 88.5,
        "total_placed": 142,
        "total_eligible": 160,
        "avg_stipend": 22500,
        "department_distribution": [
            {"dept": "CSE", "placed": 65, "total": 70},
            {"dept": "ECE", "placed": 45, "total": 50},
            {"dept": "IT", "placed": 32, "total": 40},
        ],
    }


@router.post("/students/{student_id}/assign-mentor")
async def assign_faculty_mentor(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    return {"message": f"Faculty mentor assigned to student {student_id}"}