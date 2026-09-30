import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email, subject, body):
    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
            "Content-Type": "application/json"
        },
        json={
            "from": "onboarding@resend.dev",
            "to": [to_email],
            "subject": subject,
            "text": body
        },
        timeout=10
    )

    if not response.ok:
        raise Exception(f"Email failed: {response.text}")

    return response.json()