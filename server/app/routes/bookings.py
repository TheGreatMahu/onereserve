"""
OneReserve — Bookings Routes
Blueprint: /api/bookings
All routes require JWT authentication.
"""

from datetime import datetime, date
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.booking import (
    TransportBooking, BookingPassenger,
    HotelBooking, Payment
)
from app.models.transport import Schedule, Seat
from app.models.hotel import Hotel, HotelRoom
from app.utils.helpers import success_response, error_response, generate_booking_id
from app.utils.validators import validate_transport_booking, validate_hotel_booking

bookings_bp = Blueprint("bookings", __name__)

TAX_RATE = 0.05  # 5% tax


# ── POST /api/bookings/transport ──────────────────────────────
@bookings_bp.route("/transport", methods=["POST"])
@jwt_required()
def create_transport_booking():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    errors = validate_transport_booking(data)
    if errors:
        return error_response(errors, 422)

    schedule = Schedule.query.get(data["schedule_id"])
    if not schedule:
        return error_response("Schedule not found.", 404)

    passenger_list = data.get("passengers", [])
    count = len(passenger_list)

    if schedule.available_seats < count:
        return error_response(
            f"Only {schedule.available_seats} seat(s) available.", 409
        )

    # Calculate amounts
    subtotal     = float(schedule.price) * count
    tax_amount   = round(subtotal * TAX_RATE, 2)
    total_amount = round(subtotal + tax_amount, 2)

    booking_id = generate_booking_id("OR-BK")

    # Create booking
    booking = TransportBooking(
        id             = booking_id,
        user_id        = user_id,
        schedule_id    = data["schedule_id"],
        passengers     = count,
        subtotal       = subtotal,
        tax_amount     = tax_amount,
        total_amount   = total_amount,
        payment_method = data.get("payment_method", "cash"),
        status         = "confirmed",
    )
    db.session.add(booking)

    # Create passenger records
    seat_numbers = data.get("seat_numbers", [])
    for i, p in enumerate(passenger_list):
        passenger = BookingPassenger(
            booking_id  = booking_id,
            name        = p.get("name", ""),
            age         = int(p.get("age", 25)),
            gender      = p.get("gender", "male"),
            seat_number = seat_numbers[i] if i < len(seat_numbers) else None,
            nid         = p.get("nid"),
        )
        db.session.add(passenger)

    # Mark seats as booked
    if seat_numbers:
        seats = Seat.query.filter(
            Seat.schedule_id == data["schedule_id"],
            Seat.seat_number.in_(seat_numbers)
        ).all()
        for seat in seats:
            seat.status    = "booked"
            seat.locked_at = None
            seat.locked_by = None

    # Decrease available seats
    schedule.available_seats = max(0, schedule.available_seats - count)

    # Create payment record
    payment = Payment(
        booking_id   = booking_id,
        booking_type = "transport",
        amount       = total_amount,
        method       = data.get("payment_method", "cash"),
        status       = "success",
        paid_at      = datetime.utcnow(),
    )
    db.session.add(payment)
    db.session.commit()

    return success_response({"booking": booking.to_dict()}, 201)


# ── POST /api/bookings/hotel ──────────────────────────────────
@bookings_bp.route("/hotel", methods=["POST"])
@jwt_required()
def create_hotel_booking():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    errors = validate_hotel_booking(data)
    if errors:
        return error_response(errors, 422)

    room = HotelRoom.query.get(data["room_id"])
    if not room:
        return error_response("Room not found.", 404)
    if room.available_rooms < 1:
        return error_response("No rooms available.", 409)

    # Parse dates
    try:
        check_in  = datetime.strptime(data["check_in"],  "%Y-%m-%d").date()
        check_out = datetime.strptime(data["check_out"], "%Y-%m-%d").date()
    except ValueError:
        return error_response("Invalid date format. Use YYYY-MM-DD.", 400)

    nights = (check_out - check_in).days
    if nights < 1:
        return error_response("check_out must be after check_in.", 400)

    guests       = int(data.get("guests", 1))
    subtotal     = float(room.price_per_night) * nights
    tax_amount   = round(subtotal * TAX_RATE, 2)
    total_amount = round(subtotal + tax_amount, 2)

    booking_id = generate_booking_id("OR-HB")

    booking = HotelBooking(
        id             = booking_id,
        user_id        = user_id,
        hotel_id       = room.hotel_id,
        room_id        = data["room_id"],
        check_in       = check_in,
        check_out      = check_out,
        nights         = nights,
        guests         = guests,
        subtotal       = subtotal,
        tax_amount     = tax_amount,
        total_amount   = total_amount,
        payment_method = data.get("payment_method", "cash"),
        status         = "confirmed",
    )
    db.session.add(booking)

    # Decrease available rooms
    room.available_rooms = max(0, room.available_rooms - 1)

    # Create payment record
    payment = Payment(
        booking_id   = booking_id,
        booking_type = "hotel",
        amount       = total_amount,
        method       = data.get("payment_method", "cash"),
        status       = "success",
        paid_at      = datetime.utcnow(),
    )
    db.session.add(payment)
    db.session.commit()

    return success_response({"booking": booking.to_dict()}, 201)


# ── GET /api/bookings/my ──────────────────────────────────────
@bookings_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_bookings():
    user_id = int(get_jwt_identity())

    transport = (
        TransportBooking.query
        .filter_by(user_id=user_id)
        .order_by(TransportBooking.created_at.desc())
        .all()
    )
    hotel = (
        HotelBooking.query
        .filter_by(user_id=user_id)
        .order_by(HotelBooking.created_at.desc())
        .all()
    )

    all_bookings = (
        [b.to_dict() for b in transport] +
        [b.to_dict() for b in hotel]
    )
    # Sort combined list by created_at desc
    all_bookings.sort(key=lambda x: x["created_at"] or "", reverse=True)

    return success_response({
        "bookings": all_bookings,
        "count":    len(all_bookings),
    })


# ── GET /api/bookings/<id> ────────────────────────────────────
@bookings_bp.route("/<booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    user_id = int(get_jwt_identity())

    # Check transport bookings first, then hotel
    booking = TransportBooking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking:
        return success_response({"booking": booking.to_dict()})

    booking = HotelBooking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking:
        return success_response({"booking": booking.to_dict()})

    return error_response("Booking not found.", 404)


# ── DELETE /api/bookings/<id> ─────────────────────────────────
@bookings_bp.route("/<booking_id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(booking_id):
    user_id = int(get_jwt_identity())

    # Try transport booking
    booking = TransportBooking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking:
        if booking.status == "cancelled":
            return error_response("Booking is already cancelled.", 400)
        booking.status = "cancelled"
        # Restore seats
        if booking.passenger_details:
            seat_nums = [p.seat_number for p in booking.passenger_details if p.seat_number]
            if seat_nums:
                seats = Seat.query.filter(
                    Seat.schedule_id == booking.schedule_id,
                    Seat.seat_number.in_(seat_nums)
                ).all()
                for s in seats:
                    s.status = "available"
            booking.schedule.available_seats += booking.passengers
        db.session.commit()
        return success_response({"message": "Transport booking cancelled.", "id": booking_id})

    # Try hotel booking
    booking = HotelBooking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking:
        if booking.status == "cancelled":
            return error_response("Booking is already cancelled.", 400)
        booking.status = "cancelled"
        booking.room.available_rooms += 1
        db.session.commit()
        return success_response({"message": "Hotel booking cancelled.", "id": booking_id})

    return error_response("Booking not found.", 404)
