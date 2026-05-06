"""
OneReserve — Routes Package
"""

from app.routes.auth import auth_bp
from app.routes.transport import transport_bp
from app.routes.hotels import hotels_bp
from app.routes.bookings import bookings_bp

__all__ = ["auth_bp", "transport_bp", "hotels_bp", "bookings_bp"]
