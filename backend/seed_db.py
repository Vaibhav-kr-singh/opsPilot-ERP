"""
seed_db.py - Run this script to wipe and re-seed the nexus_erp MySQL database.
Usage: python seed_db.py
Requires: pip install pymysql
"""
import pymysql
import os

DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = ''  # XAMPP default is empty
DB_NAME = 'nexus_erp'

# Read the schema.sql file from the same directory as this script
script_dir = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(script_dir, 'schema.sql')

print("=" * 55)
print("  Nexus ERP — Database Seed Script")
print("=" * 55)

try:
    conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, charset='utf8mb4')
    print(f"[OK] Connected to MySQL at {DB_HOST}")
except Exception as e:
    print(f"[FAIL] Could not connect to MySQL: {e}")
    print("  Make sure XAMPP MySQL is running!")
    exit(1)

try:
    with open(schema_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    print(f"[OK] Loaded schema from: {schema_path}")
except FileNotFoundError:
    print(f"[FAIL] schema.sql not found at: {schema_path}")
    exit(1)

# Split on semicolons and execute each statement
statements = [s.strip() for s in sql_content.split(';') if s.strip()]

try:
    with conn.cursor() as cursor:
        for stmt in statements:
            if stmt:
                cursor.execute(stmt)
    conn.commit()
    print("[OK] All tables created and seed data inserted!")
    print()
    print("  Database 'nexus_erp' is ready.")
    print("  You can now start the Flask server with:  python app.py")
    print("=" * 55)
except Exception as e:
    conn.rollback()
    print(f"[FAIL] Error executing SQL: {e}")
finally:
    conn.close()
