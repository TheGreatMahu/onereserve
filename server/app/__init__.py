"""
OneReserve — App Factory
Creates and configures the Flask application.
"""

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# ── Extension instances (shared across modules) ────────────────
db = SQLAlchemy()
jwt = JWTManager()


def create_app(env: str = None) -> Flask:
    """Application factory — returns a configured Flask app."""

    app = Flask(__name__)

    # ── Load config ────────────────────────────────────────────
    from config import config_map
    env = env or os.getenv("FLASK_ENV", "development")
    app.config.from_object(config_map.get(env, config_map["default"]))

    # ── CORS ───────────────────────────────────────────────────
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}},
        supports_credentials=True,
    )

    # ── Extensions ─────────────────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)

    # ── Register Blueprints ────────────────────────────────────
    from app.routes.auth import auth_bp
    from app.routes.transport import transport_bp
    from app.routes.hotels import hotels_bp
    from app.routes.bookings import bookings_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(transport_bp, url_prefix="/api/transport")
    app.register_blueprint(hotels_bp,    url_prefix="/api/hotels")
    app.register_blueprint(bookings_bp,  url_prefix="/api/bookings")

    # ── Health check ───────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "OneReserve API is running 🚀"}, 200

    # ── Global Error Handlers ──────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"success": False, "error": str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"success": False, "error": "Unauthorized."}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"success": False, "error": "Forbidden."}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Resource not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "error": "Method not allowed."}), 405

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"success": False, "error": str(e)}), 422

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal server error.", "detail": str(e)}), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        # Re-raise HTTP exceptions so they hit the handlers above
        from werkzeug.exceptions import HTTPException
        if isinstance(e, HTTPException):
            return jsonify({"success": False, "error": e.description}), e.code
        app.logger.error(f"Unhandled exception: {e}", exc_info=True)
        return jsonify({"success": False, "error": "An unexpected error occurred.", "detail": str(e)}), 500

    return app
