"""
OneReserve — Auth Routes
Blueprint: /api/auth
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from app import db
from app.models.user import User
from app.utils.validators import validate_register
from app.utils.helpers import success_response, error_response

auth_bp = Blueprint("auth", __name__)


# ── POST /api/auth/register ────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    # Validate input
    errors = validate_register(data)
    if errors:
        return error_response(errors, 422)

    # Check duplicate email
    if User.query.filter_by(email=data["email"].strip().lower()).first():
        return error_response("An account with this email already exists.", 409)

    # Create user
    user = User(
        name=data["name"].strip(),
        email=data["email"].strip().lower(),
        phone=data.get("phone", "").strip() or None,
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return success_response({"user": user.to_dict(), "token": token}, 201)


# ── POST /api/auth/login ───────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return error_response("Email and password are required.", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response("Invalid email or password.", 401)

    token = create_access_token(identity=str(user.id))
    return success_response({"user": user.to_dict(), "token": token})


# ── POST /api/auth/logout ──────────────────────────────────────
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless — client discards token; return 200
    return success_response({"message": "Logged out successfully."})


# ── GET /api/auth/profile ──────────────────────────────────────
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return success_response({"user": user.to_dict()})


# ── PUT /api/auth/profile ──────────────────────────────────────
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "phone" in data:
        user.phone = data["phone"].strip() or None

    db.session.commit()
    return success_response({"user": user.to_dict()})
