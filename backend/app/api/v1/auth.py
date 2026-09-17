from fastapi import APIRouter, Depends
from app.core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
    }