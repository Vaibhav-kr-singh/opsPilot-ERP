from flask import Blueprint, request, jsonify
from db import get_db_connection

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('', methods=['GET'])
def get_all_items():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM inventory_items")
            items = cursor.fetchall()
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@inventory_bp.route('/<int:id>', methods=['GET'])
def get_item(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM inventory_items WHERE id = %s", (id,))
            item = cursor.fetchone()
            if not item:
                return jsonify({"success": False, "error": "Item not found"}), 404
        return jsonify({"success": True, "data": item})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@inventory_bp.route('', methods=['POST'])
def create_item():
    data = request.get_json()
    if not data or 'code' not in data or 'name' not in data:
        return jsonify({"success": False, "error": "Missing required fields: 'code' and 'name'"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO inventory_items 
                (code, name, category, warehouse, stock, min_stock, max_stock, unit_cost, status) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data.get('code'),
                data.get('name'),
                data.get('category'),
                data.get('warehouse'),
                data.get('stock', 0),
                data.get('min_stock', 0),
                data.get('max_stock', 0),
                data.get('unit_cost', 0.00),
                data.get('status', 'Active')
            ))
            new_id = cursor.lastrowid
        return jsonify({"success": True, "data": {"id": new_id}, "message": "Item created"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@inventory_bp.route('/<int:id>', methods=['PUT'])
def update_item(id):
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400

    # Build the update query dynamically based on provided fields
    updates = []
    params = []
    for key, value in data.items():
        if key != 'id':  # Prevent updating ID
            updates.append(f"{key} = %s")
            params.append(value)
    
    if not updates:
        return jsonify({"success": False, "error": "No fields to update"}), 400

    params.append(id)
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = f"UPDATE inventory_items SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(sql, tuple(params))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "error": "Item not found or no changes made"}), 404
        return jsonify({"success": True, "message": "Item updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@inventory_bp.route('/<int:id>', methods=['DELETE'])
def delete_item(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM inventory_items WHERE id = %s", (id,))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "error": "Item not found"}), 404
        return jsonify({"success": True, "message": "Item deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()
