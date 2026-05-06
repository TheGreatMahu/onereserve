"""
OneReserve — Transport Routes
Blueprint: /api/transport
"""

from datetime import datetime, timedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_
from app import db
from app.models.transport import Schedule, Operator, Seat
from app.models.location import Location
from app.utils.helpers import success_response, error_response

transport_bp = Blueprint("transport", __name__)


# ── GET /api/transport/search ──────────────────────────────────
@transport_bp.route("/search", methods=["GET"])
def search_transport():
    """
    Query params:
      type        — bus | train | flight
      origin      — location slug  e.g. "dhaka"
      destination — location slug  e.g. "chittagong"
      date        — YYYY-MM-DD
      passengers  — integer (default 1)
    """
    t_type      = request.args.get("type", "").lower()
    origin_slug = request.args.get("origin", "").lower()
    dest_slug   = request.args.get("destination", "").lower()
    date_str    = request.args.get("date", "")
    passengers  = int(request.args.get("passengers", 1))

    if not all([t_type, origin_slug, dest_slug, date_str]):
        return error_response("type, origin, destination, and date are required.", 400)

    # Resolve location slugs
    origin = Location.query.filter_by(slug=origin_slug).first()
    dest   = Location.query.filter_by(slug=dest_slug).first()
    if not origin or not dest:
        return error_response("Invalid origin or destination.", 404)

    # Parse date — show schedules for that calendar day
    try:
        travel_date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return error_response("Invalid date format. Use YYYY-MM-DD.", 400)

    day_start = travel_date.replace(hour=0,  minute=0,  second=0)
    day_end   = travel_date.replace(hour=23, minute=59, second=59)

    schedules = (
        Schedule.query
        .filter(
            Schedule.type            == t_type,
            Schedule.from_location_id == origin.id,
            Schedule.to_location_id   == dest.id,
            Schedule.departure_time.between(day_start, day_end),
            Schedule.available_seats >= passengers,
            Schedule.status           == "active",
        )
        .order_by(Schedule.departure_time)
        .all()
    )

    return success_response({
        "results":     [s.to_dict() for s in schedules],
        "count":       len(schedules),
        "origin":      origin.to_dict(),
        "destination": dest.to_dict(),
    })


# ── GET /api/transport/schedule/<id> ──────────────────────────
@transport_bp.route("/schedule/<int:schedule_id>", methods=["GET"])
def get_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    return success_response({"schedule": schedule.to_dict()})


# ── GET /api/transport/schedule/<id>/seats ────────────────────
@transport_bp.route("/schedule/<int:schedule_id>/seats", methods=["GET"])
def get_seats(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    seats = Seat.query.filter_by(schedule_id=schedule_id).order_by(Seat.seat_number).all()

    # Auto-release locks older than 10 minutes
    cutoff = datetime.utcnow() - timedelta(minutes=10)
    for seat in seats:
        if seat.status == "locked" and seat.locked_at and seat.locked_at < cutoff:
            seat.status    = "available"
            seat.locked_at = None
            seat.locked_by = None
    db.session.commit()

    return success_response({
        "schedule_id":    schedule_id,
        "total_seats":    schedule.total_seats,
        "available":      schedule.available_seats,
        "seats":          [s.to_dict() for s in seats],
    })


# ── POST /api/transport/schedule/<id>/seats/lock ──────────────
@transport_bp.route("/schedule/<int:schedule_id>/seats/lock", methods=["POST"])
@jwt_required()
def lock_seats(schedule_id):
    user_id     = int(get_jwt_identity())
    data        = request.get_json(silent=True) or {}
    seat_numbers = data.get("seat_numbers", [])

    if not seat_numbers:
        return error_response("seat_numbers list is required.", 400)

    seats = Seat.query.filter(
        Seat.schedule_id  == schedule_id,
        Seat.seat_number.in_(seat_numbers)
    ).all()

    # Verify all requested seats are available
    unavailable = [s.seat_number for s in seats if s.status != "available"]
    if unavailable:
        return error_response(f"Seats {unavailable} are not available.", 409)

    now = datetime.utcnow()
    for seat in seats:
        seat.status    = "locked"
        seat.locked_at = now
        seat.locked_by = user_id
    db.session.commit()

    return success_response({
        "locked":  [s.seat_number for s in seats],
        "expires": (now + timedelta(minutes=10)).isoformat(),
    })


# ── POST /api/transport/schedule/<id>/seats/unlock ────────────
@transport_bp.route("/schedule/<int:schedule_id>/seats/unlock", methods=["POST"])
@jwt_required()
def unlock_seats(schedule_id):
    user_id      = int(get_jwt_identity())
    data         = request.get_json(silent=True) or {}
    seat_numbers = data.get("seat_numbers", [])

    seats = Seat.query.filter(
        Seat.schedule_id  == schedule_id,
        Seat.seat_number.in_(seat_numbers),
        Seat.locked_by    == user_id,
    ).all()

    for seat in seats:
        seat.status    = "available"
        seat.locked_at = None
        seat.locked_by = None
    db.session.commit()

    return success_response({"unlocked": [s.seat_number for s in seats]})
