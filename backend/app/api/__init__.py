from flask_restx import Namespace

def register_namespaces(api):
    # 防止循环导入，延迟导入蓝图
    from .auth import ns as auth_ns
    api.add_namespace(auth_ns, path="/api/v1/auth")
