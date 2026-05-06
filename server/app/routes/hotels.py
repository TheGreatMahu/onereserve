"""
OneReserve — Hotel Routes
Blueprint: /api/hotels
"""

from datetime import datetime
from flask import Blueprint, request
from app.models.hotel import Hotel, HotelRoom
from app.models.location import Location
from app.utils.helpers import success_response, error_response

hotels_bp = Blueprint("hotels", __name__)


# ── GET /api/hotels/search ────────────────────────────────────
@hotels_bp.route("/search", methods=["GET"])
def search_hotels():
    """
    Query params:
      destination — location slug  e.g. "cox_bazar"
      checkIn     — YYYY-MM-DD
      checkOut    — YYYY-MM-DD
      guests      — integer (default 1)
      minPrice    — optional minimum price per night
      maxPrice    — optional maximum price per night
      rating      — optional minimum rating (e.g. 4)
    """
    dest_slug = request.args.get("destination", "").lower()
    check_in  = request.args.get("checkIn",  "")
    check_out = request.args.get("checkOut", "")
    guests    = int(request.args.get("guests",   1))
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)
    min_rating = request.args.get("rating",  type=float)

    if not dest_slug:
        return error_response("destination is required.", 400)

    location = Location.query.filter_by(slug=dest_slug).first()
    if not location:
        return error_response("Invalid destination.", 404)

    # Base query
    query = Hotel.query.filter_by(location_id=location.id)

    if min_rating is not None:
        query = query.filter(Hotel.rating >= min_rating)

    hotels = query.order_by(Hotel.rating.desc()).all()

    # Filter by price / guest capacity using rooms
    results = []
    for hotel in hotels:
        rooms = hotel.rooms.filter(HotelRoom.max_guests >= guests)
        if min_price is not None:
            rooms = rooms.filter(HotelRoom.price_per_night >= min_price)
        if max_price is not None:
            rooms = rooms.filter(HotelRoom.price_per_night <= max_price)
        if rooms.count() > 0:
            h = hotel.to_dict()
            h["rooms"] = [r.to_dict() for r in rooms]
            results.append(h)

    return success_response({
        "results":     results,
        "count":       len(results),
        "destination": location.to_dict(),
    })


# ── GET /api/hotels/<id> ──────────────────────────────────────
@hotels_bp.route("/<int:hotel_id>", methods=["GET"])
def get_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    return success_response({"hotel": hotel.to_dict(include_rooms=True)})


# ── GET /api/hotels/<id>/rooms ────────────────────────────────
@hotels_bp.route("/<int:hotel_id>/rooms", methods=["GET"])
def get_rooms(hotel_id):
    """
    Query params:
      checkIn  — YYYY-MM-DD
      checkOut — YYYY-MM-DD
      guests   — integer (default 1)
    """
    Hotel.query.get_or_404(hotel_id)  # 404 if hotel not found
    guests    = int(request.args.get("guests", 1))
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)

    query = HotelRoom.query.filter(
        HotelRoom.hotel_id      == hotel_id,
        HotelRoom.max_guests    >= guests,
        HotelRoom.available_rooms > 0,
    )
    if min_price is not None:
        query = query.filter(HotelRoom.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(HotelRoom.price_per_night <= max_price)

    rooms = query.order_by(HotelRoom.price_per_night).all()
    return success_response({"rooms": [r.to_dict() for r in rooms], "count": len(rooms)})
