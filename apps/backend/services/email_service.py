import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email, subject, body):
    message = EmailMessage()
    message["From"] = os.getenv("GMAIL_EMAIL")
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(
            os.getenv("GMAIL_EMAIL"),
            os.getenv("GMAIL_APP_PASSWORD")
        )
        server.send_message(message)