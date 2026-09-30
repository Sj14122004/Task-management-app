from database import get_db_connection

def create_activity(user_id, action, message):
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO activity_logs (
                    user_id,
                    action,
                    message
                )
                VALUES (%s, %s, %s)
                """,
                (user_id, action, message)
            )

        connection.commit()
    finally:
        connection.close()


def get_activities():
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    user_id,
                    action,
                    message,
                    created_at
                FROM activity_logs
                ORDER BY created_at DESC
                """
            )

            rows = cursor.fetchall()

            return [
                {
                    "id": row[0],
                    "user_id": str(row[1]),
                    "action": row[2],
                    "message": row[3],
                    "created_at": row[4].isoformat()
                }
                for row in rows
            ]
    finally:
        connection.close()


def clear_activities():
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM activity_logs")

        connection.commit()
    finally:
        connection.close()