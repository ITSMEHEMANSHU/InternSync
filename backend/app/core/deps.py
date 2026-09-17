from fastapi import Depends, HTTPException, status, Header
from typing import Optional
from app.core.security import decode_supabase_jwt

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header",
        )
    token = authorization.replace("Bearer ", "")
    payload = decode_supabase_jwt(token)

    user_meta = payload.get("user_metadata", {}) or {}
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "role": user_meta.get("role", "student"),
        "name": user_meta.get("name"),
        "raw": payload,
    }

def require_role(*allowed_roles: str):
    async def checker(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user['role']}' not allowed",
            )
        return user
    return checker