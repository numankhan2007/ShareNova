"""
download.py — ZIP streaming download of all files in a share.
Replaces: backend/src/routes/download.ts (archiver npm → Python zipfile)
"""

import io
import zipfile

from fastapi import APIRouter, Depends, Request, Header
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services import share_service, storage_service, password_service
from app.services.uid_service import normalize_uid, is_valid_uid
from app.middleware.rate_limiter import limiter, RETRIEVAL_LIMIT

router = APIRouter(prefix="/api/download")


@router.get("/{uid}/all")
@limiter.limit(RETRIEVAL_LIMIT)
async def download_all_as_zip(
    request: Request,
    uid: str,
    db: AsyncSession = Depends(get_db),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    clean_uid = normalize_uid(uid)
    if not is_valid_uid(clean_uid):
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Invalid UID format"},
        )

    # Get share metadata to check privacy
    share = await share_service.get_share_by_uid(db, clean_uid)
    if not share:
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": "Share not found or has expired"},
        )

    # Auth check for private shares
    if share["isPrivate"]:
        if not x_session_token or not password_service.validate_session_token(
            x_session_token, clean_uid
        ):
            return JSONResponse(
                status_code=401,
                content={"success": False, "error": "Authentication required"},
            )

    # Get all files for this share
    files = await share_service.get_share_files(db, clean_uid)
    if not files:
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": "No files found for this share"},
        )

    # Build ZIP in a streaming buffer
    async def generate_zip():
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED, compresslevel=5) as zf:
            for f in files:
                file_bytes = await storage_service.get_file_bytes(f["storage_key"])
                if file_bytes:
                    zf.writestr(f["filename"], file_bytes)
        buf.seek(0)
        yield buf.read()

    return StreamingResponse(
        generate_zip(),
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="sharenova-{clean_uid}.zip"'
        },
    )
