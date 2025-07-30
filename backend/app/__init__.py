# app/__init__.py
from flask import Flask

from .config import settings
from .extensions import (
    db, migrate, ma, jwt, restx_api, celery
)

# 只导入 register_namespaces，而不是整个 app.api 模块
from .api import register_namespaces


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(settings)

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    restx_api.init_app(app)          # ⬅️ 这里用 restx_api
    celery.conf.update(app.config)

    # 注册各个 namespace
    register_namespaces(restx_api)

    return app