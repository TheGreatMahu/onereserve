"""
OneReserve — Input Validators
"""

import re


def validate_register(data: dict) -> dict:
    """Validate user registration payload. Returns dict of errors (empty = valid)."""
    errors = {}

    name = (data.get("name") or "").strip()
    if not name:
        errors["name"] = "Name is required."
    elif len(name) < 2:
        errors["name"] = "Name must be at least 2 characters."

    email = (data.get("email") or "").strip()
    if not email:
        errors["email"] = "Email is required."
    elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        errors["email"] = "Invalid email address."

    password = data.get("password") or ""
    if not password:
        errors["password"] = "Password is required."
    elif len(password) < 6:
        errors["password"] = "Password must be at least 6 characters."

    return errors


def validate_transport_booking(data: dict) -> dict:
    """Validate transport booking payload."""
    errors = {}

    if not data.get("schedule_id"):
        errors["schedule_id"] = "schedule_id is required."

    passengers = data.get("passengers", [])
    if not passengers:
        errors["passengers"] = "At least one passenger is required."
    elif not isinstance(passengers, list):
        errors["passengers"] = "passengers must be a list."
    else:
        for i, p in enumerate(passengers):
            if not p.get("name"):
                errors[f"passengers[{i}].name"] = "Passenger name is required."
            if not p.get("gender") or p["gender"] not in ("male", "female", "other"):
                errors[f"passengers[{i}].gender"] = "Gender must be male, female, or other."

    if not data.get("payment_method"):
        errors["payment_method"] = "payment_method is required."

    return errors


def validate_hotel_booking(data: dict) -> dict:
    """Validate hotel booking payload."""
    errors = {}

    if not data.get("room_id"):
        errors["room_id"] = "room_id is required."

    if not data.get("check_in"):
        errors["check_in"] = "check_in date is required."

    if not data.get("check_out"):
        errors["check_out"] = "check_out date is required."

    if not data.get("payment_method"):
        errors["payment_method"] = "payment_method is required."

    guests = data.get("guests", 1)
    if not isinstance(guests, int) or guests < 1:
        errors["guests"] = "guests must be a positive integer."

    return errors
