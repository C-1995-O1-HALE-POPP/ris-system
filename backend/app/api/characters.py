from flask_restx import Namespace, Resource, fields
from flask import request
from app.extensions import db
from app.models.character import Character
from flask_jwt_extended import jwt_required, get_jwt_identity
from loguru import logger

ns = Namespace("characters", description="角色管理")

# 请求参数模型（你已经有了这个模型）
character_model = ns.model("Character", {
    "id": fields.String,
    "name": fields.String,
    "avatar": fields.String,
    "mbtiType": fields.String,
    "zodiacSign": fields.String,
    "personality": fields.String,
    "speakingStyle": fields.String,
    "emotionalTriggers": fields.List(fields.String),
    "talkativeness": fields.Integer,
    "emotions": fields.Nested({
        "happy": fields.List(fields.String),
        "sad": fields.List(fields.String),
        "angry": fields.List(fields.String),
        "fearful": fields.List(fields.String),
        "jealous": fields.List(fields.String),
        "nervous": fields.List(fields.String)
    }),
    "openingLine": fields.String,
    "skillIds": fields.List(fields.String),
    "defaultScene": fields.String,
    "defaultScript": fields.String,
    "isPublic": fields.Boolean,
    "createdAt": fields.String,
    "updatedAt": fields.String
})

# 创建角色
@ns.route("/")
class CreateCharacter(Resource):
    @ns.expect(character_model, validate=True)
    @ns.marshal_with(character_model)
    @jwt_required()  # 确保用户已登录
    def post(self):
        """创建自定义角色"""
        data = request.json
        try:
            user_id = get_jwt_identity()  # 获取当前用户身份
            character = Character(
                name=data["name"],
                avatar=data["avatar"],
                personality=data["personality"],
                mbti_type=data["mbtiType"],
                zodiac_sign=data["zodiacSign"],
                speaking_style=data["speakingStyle"],
                emotional_triggers=data["emotionalTriggers"],
                talkativeness=data["talkativeness"],
                emotions=data["emotions"],
                opening_line=data["openingLine"],
                skill_ids=data["skillIds"],
                default_scene=data["defaultScene"],
                default_script=data["defaultScript"],
                is_public=data["isPublic"],
                created_by=user_id
            )
            db.session.add(character)
            db.session.commit()

            logger.info(f"Character {data['name']} created by user {user_id}")
            return character, 201  # 返回创建的角色信息并设置 HTTP 状态码为 201
        except Exception as e:
            logger.error(f"Error creating character: {str(e)}")
            ns.abort(500, f"Error creating character: {str(e)}")


# 获取所有角色列表
@ns.route("/")
class CharacterList(Resource):
    @ns.marshal_with(character_model)
    def get(self):
        """获取所有角色"""
        page = request.args.get('page', 1, type=int)  # 页码
        per_page = request.args.get('per_page', 10, type=int)  # 每页的角色数量

        characters = Character.query.paginate(page, per_page, False).items
        return characters

# 获取指定角色的详细信息
@ns.route("/<string:id>")
class CharacterDetail(Resource):
    @ns.marshal_with(character_model)
    def get(self, id):
        """根据角色ID获取单个角色的详细信息"""
        character = Character.query.get_or_404(id)
        return character

@ns.route("/<string:id>")
class UpdateCharacter(Resource):
    @ns.expect(character_model, validate=True)
    @ns.marshal_with(character_model)
    @jwt_required()  # 确保用户已登录
    def put(self, id):
        """更新角色信息"""
        data = request.json
        try:
            character = Character.query.get_or_404(id)
            user_id = get_jwt_identity()

            if character.created_by != user_id:
                ns.abort(403, "You do not have permission to update this character.")

            # 更新角色的各个字段
            character.name = data["name"]
            character.avatar = data["avatar"]
            character.personality = data["personality"]
            character.mbti_type = data["mbtiType"]
            character.zodiac_sign = data["zodiacSign"]
            character.speaking_style = data["speakingStyle"]
            character.emotional_triggers = data["emotionalTriggers"]
            character.talkativeness = data["talkativeness"]
            character.emotions = data["emotions"]
            character.opening_line = data["openingLine"]
            character.skill_ids = data["skillIds"]
            character.default_scene = data["defaultScene"]
            character.default_script = data["defaultScript"]
            character.is_public = data["isPublic"]

            db.session.commit()

            logger.info(f"Character {character.name} updated by user {user_id}")
            return character
        except Exception as e:
            logger.error(f"Error updating character: {str(e)}")
            ns.abort(500, f"Error updating character: {str(e)}")

@ns.route("/<string:id>")
class DeleteCharacter(Resource):
    @jwt_required()  # 确保用户已登录
    def delete(self, id):
        """删除角色"""
        try:
            character = Character.query.get_or_404(id)

            user_id = get_jwt_identity()
            if character.created_by != user_id:
                ns.abort(403, "You do not have permission to delete this character.")

            db.session.delete(character)
            db.session.commit()

            logger.info(f"Character {character.name} deleted by user {user_id}")
            return {"success": True, "message": "Character deleted successfully"}, 200
        except Exception as e:
            logger.error(f"Error deleting character: {str(e)}")
            ns.abort(500, f"Error deleting character: {str(e)}")
