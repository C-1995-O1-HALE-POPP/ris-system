from datetime import datetime, timezone
from uuid import uuid4
from app.extensions import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(512), nullable=False)  # 保持 512
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)
    email = db.Column(db.String(120), unique=True, nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # patient, caregiver, admin
    profile = db.Column(db.JSON, nullable=True)  # Store user profile as JSON