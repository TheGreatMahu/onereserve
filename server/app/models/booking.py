"""
OneReserve — Booking Models
Maps to `transport_bookings`, `booking_passengers`,
`hotel_bookings`, `payments`, and `reviews` tables.
"""

from datetime import datetime
from app import db


class TransportBooking(db.Model):
    __tablename__ = "transport_bookings"

    id             = db.Column(db.String(20), primary_key=True)   # OR-BK-000001
    user_id        = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    schedule_id    = db.Column(db.Integer, db.ForeignKey("schedules.id"), nullable=False)
    passengers     = db.Column(db.Integer, nullable=False, default=1)
    subtotal       = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount     = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    total_amount   = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status         = db.Column(
        db.Enum("pending", "confirmed", "cancelled", "completed"),
        nullable=False, default="pending"
    )
    created_at     = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at     = db.Column(
        db.DateTime, nullable=False,
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user         = db.relationship("User",     back_populates="transport_bookings")
    schedule     = db.relationship("Schedule", back_populates="bookings")
    passenger_details = db.relationship(
        "BookingPassenger", back_populates="booking",
        cascade="all, delete-orphan", lazy="joined"
    )

    def to_dict(self, include_schedule: bool = True) -> dict:
        data = {
            "id":             self.id,
            "type":           "transport",
            "passengers":     self.passengers,
            "subtotal":       float(self.subtotal),
            "tax_amount":     float(self.tax_amount),
            "total_amount":   float(self.total_amount),
            "payment_method": self.payment_method,
            "status":         self.status,
            "created_at":     self.created_at.isoformat() if self.created_at else None,
            "passenger_details": [p.to_dict() for p in self.passenger_details],
        }
        if include_schedule and self.schedule:
            data["schedule"] = self.schedule.to_dict()
        return data


class BookingPassenger(db.Model):
    __tablename__ = "booking_passengers"

    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id  = db.Column(db.String(20), db.ForeignKey("transport_bookings.id", ondelete="CASCADE"), nullable=False)
    name        = db.Column(db.String(100), nullable=False)
    age         = db.Column(db.Integer, nullable=False)
    gender      = db.Column(db.Enum("male", "female", "other"), nullable=False)
    seat_number = db.Column(db.String(10), default=None)
    nid         = db.Column(db.String(50), default=None)

    booking = db.relationship("TransportBooking", back_populates="passenger_details")

    def to_dict(self) -> dict:
        return {
            "id":          self.id,
            "name":        self.name,
            "age":         self.age,
            "gender":      self.gender,
            "seat_number": self.seat_number,
        }


class HotelBooking(db.Model):
    __tablename__ = "hotel_bookings"

    id             = db.Column(db.String(20), primary_key=True)   # OR-HB-000001
    user_id        = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hotel_id       = db.Column(db.Integer, db.ForeignKey("hotels.id"), nullable=False)
    room_id        = db.Column(db.Integer, db.ForeignKey("hotel_rooms.id"), nullable=False)
    check_in       = db.Column(db.Date, nullable=False)
    check_out      = db.Column(db.Date, nullable=False)
    nights         = db.Column(db.Integer, nullable=False)
    guests         = db.Column(db.Integer, nullable=False, default=1)
    subtotal       = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount     = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    total_amount   = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status         = db.Column(
        db.Enum("pending", "confirmed", "cancelled", "completed"),
        nullable=False, default="pending"
    )
    created_at     = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at     = db.Column(
        db.DateTime, nullable=False,
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user  = db.relationship("User",      back_populates="hotel_bookings")
    hotel = db.relationship("Hotel",     back_populates="bookings")
    room  = db.relationship("HotelRoom", foreign_keys=[room_id])

    def to_dict(self, include_hotel: bool = True) -> dict:
        data = {
            "id":             self.id,
            "type":           "hotel",
            "check_in":       self.check_in.isoformat()  if self.check_in  else None,
            "check_out":      self.check_out.isoformat() if self.check_out else None,
            "nights":         self.nights,
            "guests":         self.guests,
            "subtotal":       float(self.subtotal),
            "tax_amount":     float(self.tax_amount),
            "total_amount":   float(self.total_amount),
            "payment_method": self.payment_method,
            "status":         self.status,
            "created_at":     self.created_at.isoformat() if self.created_at else None,
            "room":           self.room.to_dict() if self.room else None,
        }
        if include_hotel and self.hotel:
            data["hotel"] = self.hotel.to_dict()
        return data


class Payment(db.Model):
    __tablename__ = "payments"

    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id     = db.Column(db.String(20), nullable=False)
    booking_type   = db.Column(db.Enum("transport", "hotel"), nullable=False)
    amount         = db.Column(db.Numeric(10, 2), nullable=False)
    method         = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(100), default=None)
    status         = db.Column(
        db.Enum("pending", "success", "failed", "refunded"),
        nullable=False, default="pending"
    )
    paid_at        = db.Column(db.DateTime, default=None)
    created_at     = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id":             self.id,
            "booking_id":     self.booking_id,
            "booking_type":   self.booking_type,
            "amount":         float(self.amount),
            "method":         self.method,
            "transaction_id": self.transaction_id,
            "status":         self.status,
            "paid_at":        self.paid_at.isoformat() if self.paid_at else None,
        }


class Review(db.Model):
    __tablename__ = "reviews"

    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = db.Column(db.Enum("hotel", "transport"), nullable=False)
    target_id   = db.Column(db.Integer, nullable=False)
    rating      = db.Column(db.SmallInteger, nullable=False)
    comment     = db.Column(db.Text, default=None)
    created_at  = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", foreign_keys=[user_id])

    def to_dict(self) -> dict:
        return {
            "id":          self.id,
            "target_type": self.target_type,
            "target_id":   self.target_id,
            "rating":      self.rating,
            "comment":     self.comment,
            "created_at":  self.created_at.isoformat() if self.created_at else None,
            "user_name":   self.user.name if self.user else None,
        }
