from flask import Blueprint
from controllers.task_controller import (
    create_task_controller,
    get_tasks_controller,
    update_task_controller,
    delete_task_controller
)

task_bp = Blueprint("tasks", __name__)

@task_bp.post("/api/tasks")
def create_task():
    return create_task_controller()

@task_bp.get("/api/tasks")
def get_tasks():
    return get_tasks_controller()

@task_bp.patch("/api/tasks/<task_id>")
def update_task(task_id):
    return update_task_controller(task_id)

@task_bp.delete("/api/tasks/<task_id>")
def delete_task(task_id):
    return delete_task_controller(task_id)