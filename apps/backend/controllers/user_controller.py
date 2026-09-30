from flask import session
from services.user_service import get_users_service

def get_users_controller():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "User is not logged in"}, 401

    try:
        return get_users_service(user_id)
    except Exception as error:
        return {"error": str(error)}, 500