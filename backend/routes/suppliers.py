from flask import Blueprint, request, jsonify
from db import get_db_connection

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('', methods=['GET'])
def get_all_suppliers():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM suppliers")
            items = cursor.fetchall()
            
            # Format dates to string for JSON serialization
            for item in items:
                if item.get('last_delivery'):
                    item['last_delivery'] = item['last_delivery'].strftime('%Y-%m-%d')
                    
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@suppliers_bp.route('/<int:id>', methods=['GET'])
def get_supplier(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM suppliers WHERE id = %s", (id,))
            item = cursor.fetchone()
            if not item:
                return jsonify({"success": False, "error": "Supplier not found"}), 404
                
            if item.get('last_delivery'):
                item['last_delivery'] = item['last_delivery'].strftime('%Y-%m-%d')
                
        return jsonify({"success": True, "data": item})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@suppliers_bp.route('', methods=['POST'])
def create_supplier():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"success": False, "error": "Missing required field: 'name'"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO suppliers 
                (name, contact, category, lead_time, rating, last_delivery, active_orders, status) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data.get('name'),
                data.get('contact'),
                data.get('category'),
                data.get('lead_time', 0),
                data.get('rating', 0.0),
                data.get('last_delivery'),
                data.get('active_orders', 0),
                data.get('status', 'Active')
            ))
            new_id = cursor.lastrowid
        return jsonify({"success": True, "data": {"id": new_id}, "message": "Supplier created"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@suppliers_bp.route('/<int:id>', methods=['PUT'])
def update_supplier(id):
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400

    updates = []
    params = []
    for key, value in data.items():
        if key != 'id':
            updates.append(f"{key} = %s")
            params.append(value)
    
    if not updates:
        return jsonify({"success": False, "error": "No fields to update"}), 400

    params.append(id)
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = f"UPDATE suppliers SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(sql, tuple(params))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "error": "Supplier not found or no changes made"}), 404
        return jsonify({"success": True, "message": "Supplier updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@suppliers_bp.route('/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM suppliers WHERE id = %s", (id,))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "error": "Supplier not found"}), 404
        return jsonify({"success": True, "message": "Supplier deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()
