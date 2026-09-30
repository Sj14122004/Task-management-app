from flask import Blueprint
from controllers.user_controller import get_users_controller

user_bp = Blueprint("users", __name__)

@user_bp.get("/api/users")
def get_users():
    return get_users_controller()