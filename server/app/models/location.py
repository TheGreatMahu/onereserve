"""
OneReserve — Location Model
Maps to the `locations` table.
"""

from datetime import datetime
from app import db


class Location(db.Model):
    __tablename__ = "locations"

    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    slug       = db.Column(db.String(60), nullable=False, unique=True)
    name       = db.Column(db.String(100), nullable=False)
    type       = db.Column(db.Enum("domestic", "international"), nullable=False, default="domestic")
    latitude   = db.Column(db.Numeric(10, 7), default=None)
    longitude  = db.Column(db.Numeric(10, 7), default=None)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id":        self.id,
            "slug":      self.slug,
            "name":      self.name,
            "type":      self.type,
            "latitude":  float(self.latitude)  if self.latitude  else None,
            "longitude": float(self.longitude) if self.longitude else None,
        }

    def __repr__(self):
        return f"<Location {self.slug}>"
