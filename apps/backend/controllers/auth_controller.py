from flask import request, session
from services.auth_service import google_login_service, logout_service
from database import get_db_connection

def google_login_controller():
    data = request.get_json()

    if not data:
        return {"error": "Request body is required"}, 400

    credential = data.get("credential")

    if not credential:
        return {"error": "Google credential is required"}, 400

    return google_login_service(credential)

def get_current_user_controller():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Not authenticated"}, 401

    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, email, avatar_url
                FROM users
                WHERE id = %s
            """, (user_id,))

            user = cursor.fetchone()

            if not user:
                session.clear()
                return {"error": "User not found"}, 401

            return {
                "user": {
                    "id": str(user[0]),
                    "name": user[1],
                    "email": user[2],
                    "avatar_url": user[3]
                }
            }, 200
    finally:
        connection.close()

def logout_controller():
    return logout_service()