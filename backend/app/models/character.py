from datetime import datetime
from app.extensions import db
from uuid import uuid4

class Character(db.Model):
    __tablename__ = 'characters'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255))
    mbti_type = db.Column(db.String(4))
    zodiac_sign = db.Column(db.String(50))
    personality = db.Column(db.Text)  # 使用 Text 类型来存储较长的字符串
    speaking_style = db.Column(db.Text)  # 使用 Text 类型
    emotional_triggers = db.Column(db.ARRAY(db.String))  # 依然可以是列表，但如果有很多项，也可以考虑使用 Text
    talkativeness = db.Column(db.Integer)
    emotions = db.Column(db.JSON)
    opening_line = db.Column(db.Text)  # 使用 Text 类型来处理较长的开场白
    skill_ids = db.Column(db.ARRAY(db.String))
    default_scene = db.Column(db.Text)  # 如果场景脚本内容可能很长
    default_script = db.Column(db.Text)  # 使用 Text 类型
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)