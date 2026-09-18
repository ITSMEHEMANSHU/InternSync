from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import User, Role, Institute

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
async def me(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user["id"]))
    db_user = result.scalar_one_or_none()

    user_meta = user.get("raw", {}).get("user_metadata", {}) or {}

    if not db_user:
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"] or user_meta.get("name"),
            "role": user["role"],
            "status": "active",
            "is_super_admin": False,
            "institute": None,
        }

    # Role lookup
    role_code = user["role"]
    if db_user.role_id:
        role_result = await db.execute(
            select(Role).where(Role.id == db_user.role_id)
        )
        role_obj = role_result.scalar_one_or_none()
        if role_obj:
            role_code = role_obj.code

    # Institute lookup
    institute = None
    if db_user.institute_id:
        inst_result = await db.execute(
            select(Institute).where(Institute.id == db_user.institute_id)
        )
        institute = inst_result.scalar_one_or_none()

    return {
        "id": str(db_user.id),
        "email": db_user.email,
        "name": db_user.name or user_meta.get("name"),
        "role": role_code,
        "status": db_user.status,
        "is_super_admin": db_user.is_super_admin,
        "institute": (
            {
                "id": str(institute.id),
                "name": institute.name,
                "code": institute.code,
                "city": institute.city,
            }
            if institute
            else None
        ),
    }