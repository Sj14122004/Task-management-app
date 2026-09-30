from flask import request, session
from services.task_service import (
    create_task_service,
    get_tasks_service,
    update_task_service,
    delete_task_service
)

def create_task_controller():
    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    user_id = session.get("user_id")

    if not user_id:
        return {
            "error": "User is not logged in"
        }, 401

    title = data.get("title")
    description = data.get("description")
    assigned_to = data.get("assigned_to")
    due_date = data.get("due_date")

    if not title:
        return {
            "error": "title is required"
        }, 400

    try:
        return create_task_service(
            title,
            description,
            user_id,
            assigned_to,
            due_date
        )

    except Exception as error:
        return {
            "error": str(error)
        }, 500

def get_tasks_controller():
    user_id = session.get("user_id")

    if not user_id:
        return {
            "error": "User is not logged in"
        }, 401

    try:
        return get_tasks_service(user_id)

    except Exception as error:
        return {
            "error": str(error)
        }, 500

def update_task_controller(task_id):
    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    user_id = session.get("user_id")

    if not user_id:
        return {
            "error": "User is not logged in"
        }, 401

    status = data.get("status")

    if not status:
        return {
            "error": "status is required"
        }, 400

    allowed_statuses = [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED"
    ]

    if status not in allowed_statuses:
        return {
            "error": "Invalid status"
        }, 400

    try:
        return update_task_service(
            task_id,
            user_id,
            status
        )

    except Exception as error:
        return {
            "error": str(error)
        }, 500

def delete_task_controller(task_id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "User is not logged in"}, 401

    try:
        return delete_task_service(task_id, user_id)
    except Exception as error:
        return {
            "error": str(error)
            }, 500