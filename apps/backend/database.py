import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg.connect(os.getenv("DATABASE_URL"))

if __name__ == "__main__":
    connection = get_db_connection()
    print("Databse connected")
    connection.close()