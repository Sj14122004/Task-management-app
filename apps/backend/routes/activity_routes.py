from flask import Blueprint
from controllers.activity_controller import (
    get_activity_controller,
    clear_activity_controller
)

activity_bp = Blueprint(
    "activity",
    __name__,
    url_prefix="/api/activities"
)

@activity_bp.route("", methods=["GET"])
def get_activities():
    return get_activity_controller()

@activity_bp.route("", methods=["DELETE"])
def clear_activities():
    return clear_activity_controller()