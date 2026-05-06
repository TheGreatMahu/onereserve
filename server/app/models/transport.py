"""
OneReserve — Transport Models
Maps to `operators`, `schedules`, and `seats` tables.
"""

import json
from datetime import datetime
from app import db


class Operator(db.Model):
    __tablename__ = "operators"

    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name       = db.Column(db.String(100), nullable=False)
    type       = db.Column(db.Enum("bus", "train", "flight"), nullable=False)
    logo_url   = db.Column(db.String(255), default=None)
    rating     = db.Column(db.Numeric(2, 1), nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    schedules  = db.relationship("Schedule", back_populates="operator", lazy="dynamic")

    def to_dict(self) -> dict:
        return {
            "id":       self.id,
            "name":     self.name,
            "type":     self.type,
            "logo_url": self.logo_url,
            "rating":   float(self.rating),
        }

    def __repr__(self):
        return f"<Operator {self.name}>"


class Schedule(db.Model):
    __tablename__ = "schedules"

    id               = db.Column(db.Integer, primary_key=True, autoincrement=True)
    operator_id      = db.Column(db.Integer, db.ForeignKey("operators.id"), nullable=False)
    type             = db.Column(db.Enum("bus", "train", "flight"), nullable=False)
    from_location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)
    to_location_id   = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)
    departure_time   = db.Column(db.DateTime, nullable=False)
    arrival_time     = db.Column(db.DateTime, nullable=False)
    price            = db.Column(db.Numeric(10, 2), nullable=False)
    total_seats      = db.Column(db.Integer, nullable=False)
    available_seats  = db.Column(db.Integer, nullable=False)
    vehicle_number   = db.Column(db.String(50), default=None)
    class_           = db.Column("class", db.String(50), default=None)
    amenities        = db.Column(db.JSON, default=None)
    status           = db.Column(
        db.Enum("active", "cancelled", "completed"),
        nullable=False, default="active"
    )
    created_at       = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # ── Relationships ──────────────────────────────────────────
    operator      = db.relationship("Operator",  back_populates="schedules")
    from_location = db.relationship("Location",  foreign_keys=[from_location_id])
    to_location   = db.relationship("Location",  foreign_keys=[to_location_id])
    seats         = db.relationship("Seat",       back_populates="schedule", lazy="dynamic",
                                    cascade="all, delete-orphan")
    bookings      = db.relationship("TransportBooking", back_populates="schedule", lazy="dynamic")

    def to_dict(self, include_operator: bool = True) -> dict:
        data = {
            "id":              self.id,
            "type":            self.type,
            "departure_time":  self.departure_time.isoformat() if self.departure_time else None,
            "arrival_time":    self.arrival_time.isoformat()   if self.arrival_time   else None,
            "price":           float(self.price),
            "total_seats":     self.total_seats,
            "available_seats": self.available_seats,
            "vehicle_number":  self.vehicle_number,
            "class":           self.class_,
            "amenities":       self.amenities or [],
            "status":          self.status,
            "from_location":   self.from_location.to_dict() if self.from_location else None,
            "to_location":     self.to_location.to_dict()   if self.to_location   else None,
        }
        if include_operator and self.operator:
            data["operator"] = self.operator.to_dict()
        return data

    def __repr__(self):
        return f"<Schedule #{self.id} {self.type}>"


class Seat(db.Model):
    __tablename__ = "seats"

    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
    seat_number = db.Column(db.String(10), nullable=False)
    status      = db.Column(
        db.Enum("available", "booked", "locked"),
        nullable=False, default="available"
    )
    locked_at   = db.Column(db.DateTime, default=None)
    locked_by   = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), default=None)

    schedule    = db.relationship("Schedule", back_populates="seats")

    def to_dict(self) -> dict:
        return {
            "id":          self.id,
            "seat_number": self.seat_number,
            "status":      self.status,
            "locked_at":   self.locked_at.isoformat() if self.locked_at else None,
        }

    def __repr__(self):
        return f"<Seat {self.seat_number} [{self.status}]>"
