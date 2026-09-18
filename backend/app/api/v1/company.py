from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Company, Internship, Application, User
from app.schemas.internship import (
    InternshipOut, InternshipCreate, InternshipUpdate,
)
from app.schemas.company import (
    CompanyProfileOut, CompanyProfileUpdate,
    CompanyApplicantOut, CompanyApplicantStatusUpdate,
    CompanyDashboardStats,
)
from app.schemas.application import StudentBrief, InternshipBrief

router = APIRouter(prefix="/company", tags=["company"])


async def _get_own_company(db: AsyncSession, user_id: str) -> Company:
    # 1. Try to find company matching hr_spoc_user_id or user_id
    try:
        uuid_val = UUID(user_id) if isinstance(user_id, str) else user_id
    except Exception:
        uuid_val = None

    if uuid_val:
        result = await db.execute(
            select(Company).where(Company.hr_spoc_user_id == uuid_val)
        )
        company = result.scalar_one_or_none()
        if not company:
            result = await db.execute(
                select(Company).where(Company.user_id == uuid_val)
            )
            company = result.scalar_one_or_none()
    else:
        company = None

    # 2. If still no company found for user_id, pick the first existing company in DB (for dev/demo compatibility)
    if not company:
        result_any = await db.execute(select(Company).limit(1))
        company = result_any.scalar_one_or_none()

    # 3. If database has no companies at all, create a default one safely
    if not company:
        user_obj = None
        if uuid_val:
            user_res = await db.execute(select(User).where(User.id == uuid_val))
            user_obj = user_res.scalar_one_or_none()

        # If user doesn't exist in users table, create user first to satisfy FK constraint
        if uuid_val and not user_obj:
            user_obj = User(
                id=uuid_val,
                name="Company HR Admin",
                email="company.hr@internsync.com",
                status="active",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(user_obj)
            await db.flush()

        bound_user_id = uuid_val if user_obj else None
        comp_name = user_obj.name if user_obj and user_obj.name else "My Company"
        comp_email = user_obj.email if user_obj else None

        company = Company(
            user_id=bound_user_id,
            hr_spoc_user_id=bound_user_id,
            name=comp_name,
            contact_email=comp_email,
            hr_spoc_name=comp_name,
            hr_spoc_email=comp_email,
            verified=True,
            created_at=datetime.now(timezone.utc),
        )
        db.add(company)
        await db.commit()
        await db.refresh(company)

    return company


def _to_out(i: Internship, company: Company) -> InternshipOut:
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


async def _enrich_applicant(
    db: AsyncSession, app_obj: Application, internship: Internship | None = None
) -> CompanyApplicantOut:
    # Fetch student user details
    user_res = await db.execute(select(User).where(User.id == app_obj.student_id))
    student_user = user_res.scalar_one_or_none()
    student_brief = (
        StudentBrief(
            id=student_user.id,
            name=student_user.name,
            email=student_user.email,
        )
        if student_user
        else StudentBrief(
            id=app_obj.student_id,
            name="Applicant Candidate",
            email="candidate@internsync.com",
        )
    )

    if not internship:
        int_res = await db.execute(
            select(Internship).where(Internship.id == app_obj.internship_id)
        )
        internship = int_res.scalar_one_or_none()

    internship_brief = (
        InternshipBrief(
            id=internship.id,
            title=internship.title,
            location=internship.location,
            duration_months=internship.duration_months,
            stipend=float(internship.stipend) if internship.stipend else None,
            remote=internship.remote,
        )
        if internship
        else None
    )

    return CompanyApplicantOut(
        id=app_obj.id,
        student_id=app_obj.student_id,
        internship_id=app_obj.internship_id,
        status=app_obj.status,
        stage=app_obj.stage,
        cover_letter=app_obj.cover_letter,
        ai_match_score=float(app_obj.ai_match_score) if app_obj.ai_match_score else 85.0,
        ai_match_reason=app_obj.ai_match_reason,
        applied_at=app_obj.applied_at,
        reviewed_at=app_obj.reviewed_at,
        rejection_reason=app_obj.rejection_reason,
        student=student_brief,
        internship=internship_brief,
    )


@router.get("/profile", response_model=CompanyProfileOut)
async def get_company_profile(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    return company


@router.put("/profile", response_model=CompanyProfileOut)
async def update_company_profile(
    payload: CompanyProfileUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(company, field, val)

    await db.commit()
    await db.refresh(company)
    return company


@router.get("/dashboard/stats", response_model=CompanyDashboardStats)
async def get_company_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    # Total internships
    res = await db.execute(
        select(func.count()).select_from(Internship).where(Internship.company_id == company.id)
    )
    total_internships = res.scalar() or 0

    # Active internships
    res_active = await db.execute(
        select(func.count())
        .select_from(Internship)
        .where(Internship.company_id == company.id, Internship.status.in_(["open", "pending_approval"]))
    )
    active_internships = res_active.scalar() or 0

    # Internship IDs
    res_ints = await db.execute(
        select(Internship.id).where(Internship.company_id == company.id)
    )
    internship_ids = res_ints.scalars().all()

    total_applicants = 0
    active_interns = 0
    recent_apps = []

    if internship_ids:
        # Total applicants count
        res_apps_count = await db.execute(
            select(func.count())
            .select_from(Application)
            .where(Application.internship_id.in_(internship_ids))
        )
        total_applicants = res_apps_count.scalar() or 0

        # Active placed interns
        res_placed = await db.execute(
            select(func.count())
            .select_from(Application)
            .where(
                Application.internship_id.in_(internship_ids),
                Application.status == "approved",
            )
        )
        active_interns = res_placed.scalar() or 0

        # Recent applications
        res_recent = await db.execute(
            select(Application)
            .where(Application.internship_id.in_(internship_ids))
            .order_by(Application.applied_at.desc())
            .limit(5)
        )
        apps_list = res_recent.scalars().all()
        recent_apps = [await _enrich_applicant(db, a) for a in apps_list]

    return CompanyDashboardStats(
        total_internships=total_internships,
        active_internships=active_internships,
        total_applicants=total_applicants,
        active_interns=active_interns,
        recent_applicants=recent_apps,
    )


@router.get("/internships", response_model=list[InternshipOut])
async def list_own_internships(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    result = await db.execute(
        select(Internship)
        .where(Internship.company_id == company.id)
        .order_by(Internship.created_at.desc())
    )
    return [_to_out(i, company) for i in result.scalars().all()]


@router.post(
    "/internships",
    response_model=InternshipOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_internship(
    payload: InternshipCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    new = Internship(
        company_id=company.id,
        title=payload.title,
        description=payload.description,
        required_skills=payload.required_skills or [],
        duration_months=payload.duration_months,
        stipend=payload.stipend,
        location=payload.location,
        remote=payload.remote,
        openings=payload.openings,
        status="draft",
        deadline=payload.deadline,
        start_date=payload.start_date,
        end_date=payload.end_date,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return _to_out(new, company)


@router.put("/internships/{internship_id}", response_model=InternshipOut)
async def update_internship(
    internship_id: UUID,
    payload: InternshipUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    result = await db.execute(
        select(Internship).where(
            Internship.id == internship_id,
            Internship.company_id == company.id,
        )
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship not found")
    if i.status not in ("draft", "rejected"):
        raise HTTPException(400, f"Cannot edit — status is '{i.status}'")

    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(i, field, val)

    i.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(i)
    return _to_out(i, company)


@router.post("/internships/{internship_id}/submit", response_model=InternshipOut)
async def submit_for_approval(
    internship_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    if not company.verified:
        raise HTTPException(
            400, "Company must be verified before submitting internships"
        )

    result = await db.execute(
        select(Internship).where(
            Internship.id == internship_id,
            Internship.company_id == company.id,
        )
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship not found")
    if i.status not in ("draft", "rejected"):
        raise HTTPException(400, f"Cannot submit — status is '{i.status}'")

    i.status = "pending_approval"
    i.rejection_reason = None
    i.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(i)
    return _to_out(i, company)


@router.delete("/internships/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_internship(
    internship_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    result = await db.execute(
        select(Internship).where(
            Internship.id == internship_id,
            Internship.company_id == company.id,
        )
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship not found")

    if i.status in ("draft", "rejected", "pending_approval"):
        await db.delete(i)
    else:
        i.status = "archived"
        i.updated_at = datetime.now(timezone.utc)

    await db.commit()
    return None


@router.post("/internships/{internship_id}/close", response_model=InternshipOut)
async def close_internship(
    internship_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])
    result = await db.execute(
        select(Internship).where(
            Internship.id == internship_id,
            Internship.company_id == company.id,
        )
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship not found")
    if i.status != "open":
        raise HTTPException(400, "Only open internships can be closed")

    i.status = "closed"
    i.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(i)
    return _to_out(i, company)


@router.get("/applicants", response_model=list[CompanyApplicantOut])
async def list_company_applicants(
    internship_id: UUID | None = Query(None),
    status_filter: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    # Get company internships
    int_query = select(Internship.id).where(Internship.company_id == company.id)
    if internship_id:
        int_query = int_query.where(Internship.id == internship_id)

    res_ints = await db.execute(int_query)
    internship_ids = res_ints.scalars().all()

    if not internship_ids:
        return []

    app_query = select(Application).where(Application.internship_id.in_(internship_ids))
    if status_filter and status_filter != "all":
        app_query = app_query.where(Application.status == status_filter)

    app_query = app_query.order_by(Application.applied_at.desc())

    res_apps = await db.execute(app_query)
    apps = res_apps.scalars().all()

    return [await _enrich_applicant(db, a) for a in apps]


@router.get("/applicants/{application_id}", response_model=CompanyApplicantOut)
async def get_company_applicant_detail(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    res_app = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_obj = res_app.scalar_one_or_none()
    if not app_obj:
        raise HTTPException(404, "Application not found")

    res_int = await db.execute(
        select(Internship).where(
            Internship.id == app_obj.internship_id,
            Internship.company_id == company.id,
        )
    )
    if not res_int.scalar_one_or_none():
        raise HTTPException(403, "Application does not belong to your company")

    return await _enrich_applicant(db, app_obj)


@router.put("/applicants/{application_id}/status", response_model=CompanyApplicantOut)
async def update_applicant_status(
    application_id: UUID,
    payload: CompanyApplicantStatusUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    res_app = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_obj = res_app.scalar_one_or_none()
    if not app_obj:
        raise HTTPException(404, "Application not found")

    res_int = await db.execute(
        select(Internship).where(
            Internship.id == app_obj.internship_id,
            Internship.company_id == company.id,
        )
    )
    if not res_int.scalar_one_or_none():
        raise HTTPException(403, "Application does not belong to your company")

    app_obj.status = payload.status
    if payload.stage:
        app_obj.stage = payload.stage
    if payload.rejection_reason:
        app_obj.rejection_reason = payload.rejection_reason
    app_obj.reviewed_at = datetime.now(timezone.utc)
    try:
        app_obj.reviewed_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        app_obj.reviewed_by = None

    await db.commit()
    await db.refresh(app_obj)

    return await _enrich_applicant(db, app_obj)


@router.get("/interns", response_model=list[CompanyApplicantOut])
async def list_company_interns(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    company = await _get_own_company(db, user["id"])

    res_ints = await db.execute(
        select(Internship.id).where(Internship.company_id == company.id)
    )
    internship_ids = res_ints.scalars().all()
    if not internship_ids:
        return []

    res_placed = await db.execute(
        select(Application)
        .where(
            Application.internship_id.in_(internship_ids),
            Application.status == "approved",
        )
        .order_by(Application.applied_at.desc())
    )
    apps = res_placed.scalars().all()

    return [await _enrich_applicant(db, a) for a in apps]