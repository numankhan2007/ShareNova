"""
storage_service.py — S3/R2 storage adapter using boto3.
Replaces: backend/src/services/StorageService.ts (@aws-sdk/client-s3)
"""

import random
import string
from urllib.parse import quote

import boto3
from botocore.config import Config as BotoConfig

from app.config import settings

_endpoint = settings.R2_ENDPOINT or f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

s3_client = boto3.client(
    "s3",
    endpoint_url=_endpoint,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    region_name="auto",
    config=BotoConfig(signature_version="s3v4"),
)


async def upload_file(storage_key: str, body: bytes, mime_type: str) -> None:
    """Upload a file buffer to R2."""
    s3_client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=storage_key,
        Body=body,
        ContentType=mime_type,
    )


async def get_presigned_download_url(storage_key: str, filename: str) -> str:
    """Generate a presigned download URL with a 60-second TTL."""
    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": storage_key,
            "ResponseContentDisposition": f'attachment; filename="{quote(filename)}"',
        },
        ExpiresIn=60,
    )


async def get_file_bytes(storage_key: str) -> bytes | None:
    """Get file content as bytes (used for ZIP streaming)."""
    try:
        response = s3_client.get_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=storage_key,
        )
        return response["Body"].read()
    except Exception:
        return None


async def delete_file(storage_key: str) -> None:
    """Delete a single file from R2."""
    s3_client.delete_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=storage_key,
    )


async def delete_files(storage_keys: list[str]) -> None:
    """Delete multiple files from R2 in batches of 1000."""
    if not storage_keys:
        return
    for i in range(0, len(storage_keys), 1000):
        batch = storage_keys[i : i + 1000]
        s3_client.delete_objects(
            Bucket=settings.R2_BUCKET_NAME,
            Delete={
                "Objects": [{"Key": key} for key in batch],
                "Quiet": True,
            },
        )


def generate_storage_key(uid: str, filename: str) -> str:
    """Generate a storage key: shares/{uid}/{random}_{filename}."""
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"shares/{uid}/{suffix}_{filename}"
