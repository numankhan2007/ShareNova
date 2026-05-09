"""
mime_validator.py — Magic-byte MIME type validation.
Replaces: backend/src/middleware/mimeValidator.ts (file-type npm)

Uses python-magic which reads the actual file bytes to determine MIME type,
not the Content-Type header.
"""

import os
import magic

BLOCKED_MIMES = {
    "application/x-msdownload",
    "application/x-msdos-program",
    "application/x-sh",
    "application/x-bat",
    "application/x-msi",
    "application/x-dosexec",
    "application/x-executable",
}

BLOCKED_EXTENSIONS = {
    ".exe", ".bat", ".cmd", ".com", ".msi", ".scr",
    ".pif", ".vbs", ".js", ".ws", ".wsf",
}


def validate_file(filename: str, content: bytes) -> str | None:
    """
    Validate a file by checking both extension and magic bytes.
    Returns an error message string if blocked, or None if allowed.
    """
    # Check extension blocklist
    ext = os.path.splitext(filename)[1].lower()
    if ext in BLOCKED_EXTENSIONS:
        return f'File type "{ext}" is not allowed: {filename}'

    # Read magic bytes to determine actual MIME type
    detected_mime = magic.from_buffer(content, mime=True)
    if detected_mime in BLOCKED_MIMES:
        return f'File type "{detected_mime}" is not allowed: {filename}'

    return None
