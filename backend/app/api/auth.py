from flask_restx import Namespace, Resource, fields
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity
)
from app.extensions import db
from app.models.user import User
from loguru import logger
from datetime import datetime, timezone
ns = Namespace("auth", description="认证相关")

# 请求参数模型
register_model = ns.model("Register", {
    "username": fields.String(required=True),
    "password": fields.String(required=True),
    "email": fields.String(required=True),
    "userType": fields.String(required=True, enum=["patient", "caregiver", "admin"]),
    "profile": fields.Nested(ns.model("Profile", {
        "name": fields.String(required=True),
        "age": fields.Integer(required=True),
        "gender": fields.String(required=True, enum=["male", "female"]),
        "medicalHistory": fields.String(required=True),
        "emergencyContact": fields.String(required=True),
    }))
})

login_model = ns.model("Login", {
    "username": fields.String(required=True),
    "password": fields.String(required=True),
})

token_model = ns.model("Token", {
    "access_token": fields.String,
    "refresh_token": fields.String,
})

@ns.route("/register")
class Register(Resource):
    @ns.expect(register_model, validate=True)
    @ns.marshal_with(token_model)
    def post(self):
        data = ns.payload
        if User.query.filter_by(username=data["username"]).first():
            ns.abort(400, "Username already exists")
        if User.query.filter_by(email=data["email"]).first():
            ns.abort(400, "Email already exists")
        
        user = User(
            username=data["username"],
            password_hash=generate_password_hash(data["password"]),
            email=data["email"],
            user_type=data["userType"],
            profile=data["profile"]
        )
        db.session.add(user)
        db.session.commit()
        return _issue_tokens(user)

@ns.route("/login")
class Login(Resource):
    @ns.expect(login_model, validate=True)
    @ns.marshal_with(token_model)
    def post(self):
        data = ns.payload
        user = User.query.filter_by(username=data["username"]).first()
        if not user or not check_password_hash(user.password_hash, data["password"]):
            ns.abort(401, "Invalid credentials")
        tokens = _issue_tokens(user)
        user.last_login = datetime.now(timezone.utc)
        db.session.commit()
        logger.debug(f"User {user.username} logged in successfully")
        return tokens

@ns.route("/refresh")
class RefreshToken(Resource):
    @ns.expect(token_model, validate=True)
    @ns.marshal_with(token_model)
    @jwt_required(refresh=True)  # 强制要求传递 refresh_token
    def post(self):
        try:
            current_user = get_jwt_identity()  # 获取当前用户身份
            if not current_user:
                logger.debug("Invalid refresh token: No user identity found.")
                ns.abort(400, "Invalid refresh token: No user identity found.")
            
            logger.debug(f"Valid refresh token for user: {current_user}")  # 打印有效的 refresh_token
            user = User.query.get(current_user)
            tokens = _issue_tokens(user)  # 生成新的 access_token 和 refresh_token
            return tokens
        except Exception as e:
            logger.error(f"Error refreshing token: {str(e)}")
            ns.abort(400, f"Error refreshing token: {str(e)}")  # 返回错误信息

@ns.route("/logout")
class Logout(Resource):
    @jwt_required()
    def post(self):
        return {"success": True, "message": "登出成功"}

@ns.route("/me")
class Me(Resource):
    @jwt_required()
    def get(self):
        uid = get_jwt_identity()
        user = User.query.get_or_404(uid)
        logger.debug(f"Current JWT Token: {uid}") 
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "userType": user.user_type,
            "profile": user.profile,
            "createdAt": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None
        }
    
def _issue_tokens(user: User):
    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return {
        "access_token": access,
        "refresh_token": refresh
    }
