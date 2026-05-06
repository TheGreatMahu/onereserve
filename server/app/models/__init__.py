"""
OneReserve — Models Package
Imports all models so SQLAlchemy can discover them.
"""

from app.models.user import User
from app.models.location import Location
from app.models.transport import Operator, Schedule, Seat
from app.models.hotel import Hotel, HotelRoom
from app.models.booking import (
    TransportBooking, BookingPassenger,
    HotelBooking, Payment, Review
)

__all__ = [
    "User", "Location",
    "Operator", "Schedule", "Seat",
    "Hotel", "HotelRoom",
    "TransportBooking", "BookingPassenger",
    "HotelBooking", "Payment", "Review",
]
