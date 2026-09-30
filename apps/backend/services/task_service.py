from database import get_db_connection
from services.email_service import send_email
from services.activity_service import create_activity

def create_task_service(title, description, created_by, assigned_to, due_date):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name, email
                FROM users
                WHERE id = %s
            """, (created_by,))
            creator = cursor.fetchone()
            if not creator:
                return {"error": "Creator not found"}, 404

            assigned_user = None
            if assigned_to:
                cursor.execute("""
                    SELECT name, email
                    FROM users
                    WHERE id = %s
                """, (assigned_to,))
                assigned_user = cursor.fetchone()
                if not assigned_user:
                    return {"error": "Assigned user not found"}, 404

            cursor.execute("""
                INSERT INTO tasks
                (title, description, created_by, assigned_to, due_date)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, title, description, status, created_by,
                          assigned_to, due_date, created_at
            """, (title, description, created_by, assigned_to, due_date))
            task = cursor.fetchone()

            create_activity(
                created_by,
                "TASK_CREATED",
                f"Task created: {title}"
            )
            connection.commit()

        if assigned_user:
            send_email(
                assigned_user[1],
                "New Task Assigned",
                f"""Hello {assigned_user[0]},

You have been assigned a new task.

Task: {title}
Description: {description or "No description provided"}

Please log in to check your task."""
            )

        return {
            "message": "Task created successfully",
            "task": {
                "id": str(task[0]),
                "title": task[1],
                "description": task[2],
                "status": task[3],
                "created_by": str(task[4]),
                "assigned_to": str(task[5]) if task[5] else None,
                "due_date": task[6].isoformat() if task[6] else None,
                "created_at": task[7].isoformat()
            }
        }, 201
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

def get_tasks_service(user_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, title, description, status, created_by,
                       assigned_to, due_date, created_at, completed_at
                FROM tasks
                WHERE created_by = %s OR assigned_to = %s
                ORDER BY created_at DESC
            """, (user_id, user_id))
            tasks = cursor.fetchall()
        return {
            "tasks": [
                {
                    "id": str(task[0]),
                    "title": task[1],
                    "description": task[2],
                    "status": task[3],
                    "created_by": str(task[4]),
                    "assigned_to": str(task[5]) if task[5] else None,
                    "due_date": task[6].isoformat() if task[6] else None,
                    "created_at": task[7].isoformat(),
                    "completed_at": task[8].isoformat() if task[8] else None
                }
                for task in tasks
            ]
        }, 200
    finally:
        connection.close()

def update_task_service(task_id, user_id, status):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT created_by, assigned_to, title
                FROM tasks
                WHERE id = %s
            """, (task_id,))
            task = cursor.fetchone()
            if not task:
                return {"error": "Task not found"}, 404

            created_by = str(task[0])
            assigned_to = str(task[1]) if task[1] else None
            title = task[2]
            if user_id != created_by and user_id != assigned_to:
                return {"error": "You are not allowed to update this task"}, 403

            cursor.execute("""
                SELECT name, email
                FROM users
                WHERE id = %s
            """, (assigned_to or created_by,))
            recipient = cursor.fetchone()

            if status == "COMPLETED":
                cursor.execute("""
                    UPDATE tasks
                    SET status = %s, completed_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING id, title, description, status, created_by,
                              assigned_to, due_date, created_at, completed_at
                """, (status, task_id))
            else:
                cursor.execute("""
                    UPDATE tasks
                    SET status = %s, completed_at = NULL
                    WHERE id = %s
                    RETURNING id, title, description, status, created_by,
                              assigned_to, due_date, created_at, completed_at
                """, (status, task_id))

            updated_task = cursor.fetchone()

            if status == "COMPLETED":
                create_activity(
                    user_id,
                    "TASK_COMPLETED",
                    f"Task completed: {title}"
                )
            connection.commit()

        if status == "COMPLETED" and recipient:
            send_email(
                recipient[1],
                "Task Completed",
                f"""Hello {recipient[0]},

Your task has been completed.

Task: {title}

The task is now marked as COMPLETED."""
            )

        return {
            "message": "Task updated successfully",
            "task": {
                "id": str(updated_task[0]),
                "title": updated_task[1],
                "description": updated_task[2],
                "status": updated_task[3],
                "created_by": str(updated_task[4]),
                "assigned_to": str(updated_task[5]) if updated_task[5] else None,
                "due_date": updated_task[6].isoformat() if updated_task[6] else None,
                "created_at": updated_task[7].isoformat(),
                "completed_at": updated_task[8].isoformat() if updated_task[8] else None
            }
        }, 200
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

def delete_task_service(task_id, user_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT created_by, title
                FROM tasks
                WHERE id = %s
            """, (task_id,))
            task = cursor.fetchone()
            if not task:
                return {"error": "Task not found"}, 404

            created_by = str(task[0])
            title = task[1]
            if user_id != created_by:
                return {"error": "Only the task creator can delete this task"}, 403

            cursor.execute("""
                DELETE FROM tasks
                WHERE id = %s
            """, (task_id,))

            create_activity(
                user_id,
                "TASK_DELETED",
                f"Task deleted: {title}"
            )
            connection.commit()

        return {"message": "Task deleted successfully"}, 200
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()