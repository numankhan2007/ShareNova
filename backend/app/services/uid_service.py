"""
uid_service.py — Cryptographic UID generation with collision retry.
Replaces: backend/src/services/UIDService.ts

Algorithm: secrets.token_bytes(6) → big-endian int → decimal string → first 12 chars → zero-pad
"""

import secrets
import re

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Share


def _generate_uid_candidate() -> str:
    """Generate a single 12-digit UID candidate from 6 random bytes."""
    raw = secrets.token_bytes(6)
    num = int.from_bytes(raw, byteorder="big")
    decimal_str = str(num)[:12]
    return decimal_str.zfill(12)


async def generate_uid(db: AsyncSession, max_retries: int = 10) -> str:
    """Generate a unique 12-digit UID, retrying on collision up to max_retries times."""
    for _ in range(max_retries):
        candidate = _generate_uid_candidate()
        existing = await db.execute(select(Share.id).where(Share.uid == candidate).limit(1))
        if existing.scalar_one_or_none() is None:
            return candidate
    raise RuntimeError("Failed to generate a unique UID after max retries")


def normalize_uid(raw: str) -> str:
    """Strip all non-digit characters."""
    return re.sub(r"\D", "", raw)[:12]


def is_valid_uid(uid: str) -> bool:
    """Check if a string is exactly 12 digits."""
    return bool(re.fullmatch(r"\d{12}", uid))


def format_uid(uid: str) -> str:
    """Format a 12-digit UID into groups: '1234 5678 9012'."""
    clean = re.sub(r"\D", "", uid)[:12]
    parts = [clean[i : i + 4] for i in range(0, len(clean), 4)]
    return " ".join(parts)
