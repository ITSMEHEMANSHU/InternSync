from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import get_current_user, require_role
from app.models import Application, Internship, Company, User
from app.schemas.application import ApplicationOut, ApplicationCreate

router = APIRouter(tags=["applications"])


async def _enrich(db: AsyncSession, apps: list[Application], include_student: bool = False) -> list[ApplicationOut]:
    if not apps:
        return []

    internship_ids = list({a.internship_id for a in apps})
    internships_result = await db.execute(
        select(Internship).where(Internship.id.in_(internship_ids))
    )
    internships = {i.id: i for i in internships_result.scalars().all()}

    company_ids = list({i.company_id for i in internships.values()})
    companies_result = await db.execute(
        select(Company).where(Company.id.in_(company_ids))
    )
    companies = {c.id: c for c in companies_result.scalars().all()}

    users = {}
    if include_student:
        student_ids = list({a.student_id for a in apps})
        users_result = await db.execute(
            select(User).where(User.id.in_(student_ids))
        )
        users = {u.id: u for u in users_result.scalars().all()}

    out = []
    for a in apps:
        internship = internships.get(a.internship_id)
        company = companies.get(internship.company_id) if internship else None
        student = users.get(a.student_id) if include_student else None
        out.append(
            ApplicationOut(
                id=a.id,
                student_id=a.student_id,
                internship_id=a.internship_id,
                status=a.status,
                stage=a.stage,
                cover_letter=a.cover_letter,
                ai_match_score=float(a.ai_match_score) if a.ai_match_score else None,
                ai_match_reason=a.ai_match_reason,
                applied_at=a.applied_at,
                reviewed_at=a.reviewed_at,
                rejection_reason=a.rejection_reason,
                internship=internship,
                company=company,
                student=student,
            )
        )
    return out



@router.post(
    "/internships/{internship_id}/apply",
    response_model=ApplicationOut,
    status_code=status.HTTP_201_CREATED,
)
async def apply_to_internship(
    internship_id: UUID,
    payload: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    result = await db.execute(select(Internship).where(Internship.id == internship_id))
    internship = result.scalar_one_or_none()
    if not internship:
        raise HTTPException(404, "Internship not found")
    if internship.status != "open":
        raise HTTPException(400, "Internship is not open for applications")

    existing = await db.execute(
        select(Application).where(
            Application.student_id == user["id"],
            Application.internship_id == internship_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(409, "You have already applied to this internship")

    new_app = Application(
        student_id=user["id"],
        internship_id=internship_id,
        status="pending",
        stage="applied",
        cover_letter=payload.cover_letter,
        applied_at=datetime.now(timezone.utc),
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)

    enriched = await _enrich(db, [new_app])
    return enriched[0]


@router.get("/applications/my", response_model=list[ApplicationOut])
async def my_applications(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    result = await db.execute(
        select(Application)
        .where(Application.student_id == user["id"])
        .order_by(Application.applied_at.desc())
    )
    apps = result.scalars().all()
    return await _enrich(db, apps)


@router.get("/applications/{application_id}", response_model=ApplicationOut)
async def get_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")

    if user["role"] == "student" and app_row.student_id != user["id"]:
        raise HTTPException(403, "Not allowed")

    enriched = await _enrich(db, [app_row])
    return enriched[0]