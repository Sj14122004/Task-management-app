from flask import jsonify
from services.activity_service import (
    get_activities,
    clear_activities
)

def get_activity_controller():
    try:
        activities = get_activities()

        return jsonify({
            "activities": activities
        }), 200

    except Exception as error:
        print("Get activities error:", error)

        return jsonify({
            "error": "Failed to load activities"
        }), 500


def clear_activity_controller():
    try:
        clear_activities()

        return jsonify({
            "message": "All activities cleared successfully"
        }), 200

    except Exception as error:
        print("Clear activities error:", error)

        return jsonify({
            "error": "Failed to clear activities"
        }), 500