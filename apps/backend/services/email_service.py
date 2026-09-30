import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email, subject, body):
    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "accept": "application/json",
            "api-key": os.getenv("BREVO_API_KEY"),
            "content-type": "application/json"
        },
        json={
            "sender": {
                "email": os.getenv("BREVO_FROM_EMAIL"),
                "name": "Task Manager"
            },
            "to": [
                {
                    "email": to_email
                }
            ],
            "subject": subject,
            "textContent": body
        },
        timeout=10
    )

    if not response.ok:
        raise Exception(f"Email failed: {response.text}")

    return response.json()