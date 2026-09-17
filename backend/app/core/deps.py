from fastapi import Depends, HTTPException, status, Header
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_supabase_jwt
from app.db.session import get_db
from app.models import User, Role


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header",
        )
    token = authorization.replace("Bearer ", "")
    payload = decode_supabase_jwt(token)

    user_id = payload.get("sub")

    # Load user + role from DB — this is authoritative
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()

    role_code = "student"
    if db_user and db_user.role_id:
        role_result = await db.execute(
            select(Role).where(Role.id == db_user.role_id)
        )
        role_obj = role_result.scalar_one_or_none()
        if role_obj:
            role_code = role_obj.code

    return {
        "id": user_id,
        "email": payload.get("email"),
        "name": db_user.name if db_user else None,
        "role": role_code,
        "institute_id": str(db_user.institute_id) if db_user and db_user.institute_id else None,
        "status": db_user.status if db_user else "active",
        "is_super_admin": db_user.is_super_admin if db_user else False,
        "raw": payload,
    }


def require_role(*allowed_roles: str):
    async def checker(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user['role']}' not allowed",
            )
        if user["status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account pending approval or inactive",
            )
        return user
    return checker