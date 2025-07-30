# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_restx import Api
from celery import Celery

db      = SQLAlchemy()
migrate = Migrate()
ma      = Marshmallow()
jwt     = JWTManager()

# 建议换个名字，避免跟 “app.api” 模块混淆
restx_api = Api(
    title="RIS API",
    version="0.1",
    doc="/docs"      # Swagger UI
)

celery  = Celery(__name__)