import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, status
from functools import lru_cache
from app.core.config import settings

JWKS_URL = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"

@lru_cache(maxsize=1)
def get_jwks() -> dict:
    resp = httpx.get(JWKS_URL, timeout=10)
    resp.raise_for_status()
    return resp.json()

def _find_key(kid: str) -> dict | None:
    for key in get_jwks().get("keys", []):
        if key.get("kid") == kid:
            return key
    return None

def decode_supabase_jwt(token: str) -> dict:
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        alg = headers.get("alg", "ES256")

        key = _find_key(kid) if kid else None
        if not key:
            get_jwks.cache_clear()
            key = _find_key(kid) if kid else None
        if not key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Signing key not found",
            )

        payload = jwt.decode(
            token,
            key,
            algorithms=[alg],
            audience="authenticated",
        )
        return payload

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )