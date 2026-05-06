"""
OneReserve — Hotel Models
Maps to `hotels` and `hotel_rooms` tables.
"""

from datetime import datetime
from app import db


class Hotel(db.Model):
    __tablename__ = "hotels"

    id                   = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name                 = db.Column(db.String(150), nullable=False)
    location_id          = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)
    address              = db.Column(db.Text, nullable=False)
    category             = db.Column(db.String(30), default=None)
    rating               = db.Column(db.Numeric(2, 1), nullable=False, default=0.0)
    review_count         = db.Column(db.Integer, nullable=False, default=0)
    amenities            = db.Column(db.JSON, default=None)
    images               = db.Column(db.JSON, default=None)
    distance_from_center = db.Column(db.String(60), default=None)
    created_at           = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # ── Relationships ──────────────────────────────────────────
    location = db.relationship("Location", foreign_keys=[location_id])
    rooms    = db.relationship("HotelRoom", back_populates="hotel",
                               lazy="dynamic", cascade="all, delete-orphan")
    bookings = db.relationship("HotelBooking", back_populates="hotel", lazy="dynamic")

    def to_dict(self, include_rooms: bool = False) -> dict:
        data = {
            "id":                   self.id,
            "name":                 self.name,
            "address":              self.address,
            "category":             self.category,
            "rating":               float(self.rating),
            "review_count":         self.review_count,
            "amenities":            self.amenities or [],
            "images":               self.images or [],
            "distance_from_center": self.distance_from_center,
            "location":             self.location.to_dict() if self.location else None,
        }
        if include_rooms:
            data["rooms"] = [r.to_dict() for r in self.rooms]
        return data

    def __repr__(self):
        return f"<Hotel {self.name}>"


class HotelRoom(db.Model):
    __tablename__ = "hotel_rooms"

    id              = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hotel_id        = db.Column(db.Integer, db.ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False)
    room_type       = db.Column(db.String(100), nullable=False)
    price_per_night = db.Column(db.Numeric(10, 2), nullable=False)
    max_guests      = db.Column(db.Integer, nullable=False)
    total_rooms     = db.Column(db.Integer, nullable=False)
    available_rooms = db.Column(db.Integer, nullable=False)
    amenities       = db.Column(db.JSON, default=None)
    created_at      = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    hotel = db.relationship("Hotel", back_populates="rooms")

    def to_dict(self) -> dict:
        return {
            "id":              self.id,
            "hotel_id":        self.hotel_id,
            "room_type":       self.room_type,
            "price_per_night": float(self.price_per_night),
            "max_guests":      self.max_guests,
            "total_rooms":     self.total_rooms,
            "available_rooms": self.available_rooms,
            "amenities":       self.amenities or [],
        }

    def __repr__(self):
        return f"<HotelRoom {self.room_type} @ Hotel#{self.hotel_id}>"
