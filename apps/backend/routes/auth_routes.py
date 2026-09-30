from flask import Blueprint
from controllers.auth_controller import (
    google_login_controller,
    get_current_user_controller,
    logout_controller
)

auth_bp = Blueprint("auth", __name__)

@auth_bp.get("/api/auth/me")
def get_current_user():
    return get_current_user_controller()

@auth_bp.post("/api/auth/google")
def google_login():
    return google_login_controller()

@auth_bp.post("/api/auth/logout")
def logout():
    return logout_controller()