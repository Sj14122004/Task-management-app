from database import get_db_connection

def get_users_service(current_user_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, email, avatar_url
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            current_user = cursor.fetchone()

            cursor.execute("""
                SELECT id, name, email, avatar_url
                FROM users
                WHERE id != %s
                ORDER BY name
            """, (current_user_id,))
            users = cursor.fetchall()

        return {
            "current_user": {
                "id": str(current_user[0]),
                "name": current_user[1],
                "email": current_user[2],
                "avatar_url": current_user[3]
            } if current_user else None,
            "users": [
                {
                    "id": str(user[0]),
                    "name": user[1],
                    "email": user[2],
                    "avatar_url": user[3]
                }
                for user in users
            ]
        }, 200
    finally:
        connection.close()