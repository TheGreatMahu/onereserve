"""
OneReserve — User Model
Maps to the `users` table.
"""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name          = db.Column(db.String(100), nullable=False)
    email         = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone         = db.Column(db.String(20), default=None)
    role          = db.Column(db.Enum("user", "admin"), nullable=False, default="user")
    created_at    = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at    = db.Column(
        db.DateTime, nullable=False,
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # ── Relationships ──────────────────────────────────────────
    transport_bookings = db.relationship("TransportBooking", back_populates="user", lazy="dynamic")
    hotel_bookings     = db.relationship("HotelBooking",     back_populates="user", lazy="dynamic")

    # ── Password helpers ───────────────────────────────────────
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_sensitive: bool = False) -> dict:
        data = {
            "id":         self.id,
            "name":       self.name,
            "email":      self.email,
            "phone":      self.phone,
            "role":       self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        return data

    def __repr__(self):
        return f"<User {self.email}>"
