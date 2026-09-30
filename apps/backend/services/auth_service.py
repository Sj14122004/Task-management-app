import os
from flask import session
from google.auth.transport import requests
from google.oauth2 import id_token
from database import get_db_connection

def google_login_service(credential):
    try:
        google_user = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
        google_id = google_user["sub"]
        name = google_user.get("name", "")
        email = google_user.get("email")
        avatar_url = google_user.get("picture")

        if not email:
            return {"error": "Google account email not found"}, 400

        connection = get_db_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, name, email, avatar_url
                    FROM users
                    WHERE google_id = %s
                """, (google_id,))
                user = cursor.fetchone()

                if not user:
                    cursor.execute("""
                        INSERT INTO users
                        (google_id, name, email, avatar_url)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id, name, email, avatar_url
                    """, (google_id, name, email, avatar_url))
                    user = cursor.fetchone()
                    connection.commit()

            session["user_id"] = str(user[0])
            session.permanent = True

            return {
                "message": "Login successful",
                "user": {
                    "id": str(user[0]),
                    "name": user[1],
                    "email": user[2],
                    "avatar_url": user[3]
                }
            }, 200
        finally:
            connection.close()
    except ValueError:
        return {"error": "Invalid Google credential"}, 401

def logout_service():
    session.clear()
    return {"message": "Logout successful"}, 200