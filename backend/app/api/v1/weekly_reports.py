from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import WeeklyReport, Feedback, Assignment, User, Company
from app.schemas.weekly_report import (
    WeeklyReportOut, WeeklyReportSave, FeedbackCreate, FeedbackOut,
)
from app.schemas.application import StudentBrief

router = APIRouter(prefix="/weekly-reports", tags=["weekly-reports"])


async def _enrich_report(db: AsyncSession, r: WeeklyReport) -> WeeklyReportOut:
    res_u = await db.execute(select(User).where(User.id == r.student_id))
    u_obj = res_u.scalar_one_or_none()
    sb = StudentBrief(id=u_obj.id, name=u_obj.name, email=u_obj.email) if u_obj else None

    feedbacks = []
    if r.feedback_entries:
        for f in r.feedback_entries:
            res_fa = await db.execute(select(User).where(User.id == f.author_id))
            fa_obj = res_fa.scalar_one_or_none()
            fa_brief = StudentBrief(id=fa_obj.id, name=fa_obj.name, email=fa_obj.email) if fa_obj else None
            feedbacks.append(
                FeedbackOut(
                    id=f.id,
                    weekly_report_id=f.weekly_report_id,
                    author_id=f.author_id,
                    comments=f.comments,
                    rating=f.rating,
                    author_type=f.author_type,
                    created_at=f.created_at,
                    author=fa_brief,
                )
            )

    return WeeklyReportOut(
        id=r.id,
        assignment_id=r.assignment_id,
        student_id=r.student_id,
        week_number=r.week_number,
        start_date=r.start_date,
        end_date=r.end_date,
        summary=r.summary,
        key_learnings=r.key_learnings,
        challenges=r.challenges,
        plan_next_week=r.plan_next_week,
        hours_logged=r.hours_logged,
        status=str(r.status),
        ai_match_confidence=r.ai_match_confidence,
        ai_audit_notes=r.ai_audit_notes,
        submitted_at=r.submitted_at,
        created_at=r.created_at,
        updated_at=r.updated_at,
        student=sb,
        feedback_entries=feedbacks,
    )


@router.get("/my", response_model=list[WeeklyReportOut])
async def get_my_weekly_reports(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    res = await db.execute(
        select(WeeklyReport)
        .where(WeeklyReport.student_id == uid)
        .order_by(WeeklyReport.week_number.desc())
    )
    reports = res.scalars().all()
    return [await _enrich_report(db, r) for r in reports]


@router.post("/draft", response_model=WeeklyReportOut)
async def save_weekly_report_draft(
    payload: WeeklyReportSave,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    res_asm = await db.execute(
        select(Assignment)
        .where(Assignment.student_id == uid)
        .order_by(Assignment.created_at.desc())
    )
    asm = res_asm.scalar_one_or_none()
    if not asm:
        raise HTTPException(400, "No active internship assignment found")

    res_existing = await db.execute(
        select(WeeklyReport).where(
            WeeklyReport.student_id == uid,
            WeeklyReport.week_number == payload.week_number,
        )
    )
    r = res_existing.scalar_one_or_none()

    if r:
        r.summary = payload.summary
        r.key_learnings = payload.key_learnings
        r.challenges = payload.challenges
        r.plan_next_week = payload.plan_next_week
        r.hours_logged = payload.hours_logged
        r.updated_at = datetime.now(timezone.utc)
    else:
        r = WeeklyReport(
            assignment_id=asm.id,
            student_id=uid,
            week_number=payload.week_number,
            summary=payload.summary,
            key_learnings=payload.key_learnings,
            challenges=payload.challenges,
            plan_next_week=payload.plan_next_week,
            hours_logged=payload.hours_logged,
            status="draft",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(r)

    await db.commit()
    await db.refresh(r)
    return await _enrich_report(db, r)


@router.post("/{report_id}/submit", response_model=WeeklyReportOut)
async def submit_weekly_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    res = await db.execute(select(WeeklyReport).where(WeeklyReport.id == report_id))
    r = res.scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Weekly report not found")

    r.status = "submitted"
    r.submitted_at = datetime.now(timezone.utc)
    r.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(r)
    return await _enrich_report(db, r)


@router.post("/{report_id}/feedback", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
async def add_report_feedback(
    report_id: UUID,
    payload: FeedbackCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("company")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    res = await db.execute(select(WeeklyReport).where(WeeklyReport.id == report_id))
    r = res.scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Weekly report not found")

    r.status = "approved"

    fb = Feedback(
        weekly_report_id=r.id,
        author_id=uid,
        comments=payload.comments,
        rating=payload.rating,
        author_type="company_mentor",
        created_at=datetime.now(timezone.utc),
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)

    res_u = await db.execute(select(User).where(User.id == uid))
    u_obj = res_u.scalar_one_or_none()
    sb = StudentBrief(id=u_obj.id, name=u_obj.name, email=u_obj.email) if u_obj else None

    return FeedbackOut(
        id=fb.id,
        weekly_report_id=fb.weekly_report_id,
        author_id=fb.author_id,
        comments=fb.comments,
        rating=fb.rating,
        author_type=fb.author_type,
        created_at=fb.created_at,
        author=sb,
    )
