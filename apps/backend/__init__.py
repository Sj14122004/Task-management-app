import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from routes.health_routes import health_bp
from routes.task_routes import task_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.activity_routes import activity_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False

    CORS(
        app,
        origins=["http://localhost:3000"],
        supports_credentials=True
    )

    app.register_blueprint(health_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(activity_bp)

    return app