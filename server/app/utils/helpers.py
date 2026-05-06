"""
OneReserve — Helper Utilities
"""

from flask import jsonify
from app.models.booking import TransportBooking, HotelBooking


# ── Standard JSON Response Wrappers ───────────────────────────

def success_response(data: dict, status: int = 200):
    """Return a standard success JSON response."""
    return jsonify({"success": True, **data}), status


def error_response(message, status: int = 400):
    """Return a standard error JSON response."""
    if isinstance(message, dict):
        return jsonify({"success": False, "errors": message}), status
    return jsonify({"success": False, "error": message}), status


# ── Booking ID Generator ───────────────────────────────────────

def generate_booking_id(prefix: str) -> str:
    """
    Generate a sequential booking ID like OR-BK-000007.
    Checks the appropriate table to find the next number.
    """
    if prefix == "OR-BK":
        last = (
            TransportBooking.query
            .order_by(TransportBooking.id.desc())
            .first()
        )
    else:
        last = (
            HotelBooking.query
            .order_by(HotelBooking.id.desc())
            .first()
        )

    if last:
        # Extract number from e.g. "OR-BK-000007" → 7
        try:
            num = int(last.id.split("-")[-1]) + 1
        except (ValueError, IndexError):
            num = 1
    else:
        num = 1

    return f"{prefix}-{num:06d}"


# ── Pagination Helper ──────────────────────────────────────────

def paginate(query, page: int = 1, per_page: int = 20) -> dict:
    """Paginate a SQLAlchemy query and return a dict with items + meta."""
    total   = query.count()
    items   = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "items":       items,
        "total":       total,
        "page":        page,
        "per_page":    per_page,
        "total_pages": (total + per_page - 1) // per_page,
        "has_next":    page * per_page < total,
        "has_prev":    page > 1,
    }
