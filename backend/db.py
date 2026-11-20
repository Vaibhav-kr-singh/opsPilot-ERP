import os
import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv

load_dotenv()

# MySQL Configuration
# Defaults match a fresh XAMPP install (root user, no password).
# Override via environment variables for other setups.
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
DB_NAME = os.environ.get('DB_NAME', 'nexus_erp')

def get_db_connection():
    """
    Establishes and returns a connection to the MySQL database.
    We use DictCursor so rows are returned as dictionaries, which map perfectly to JSON.
    """
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=DictCursor,
        autocommit=True
    )
