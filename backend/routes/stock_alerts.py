from flask import Blueprint, request, jsonify
from db import get_db_connection

stock_alerts_bp = Blueprint('stock_alerts', __name__)

@stock_alerts_bp.route('', methods=['GET'])
def get_all_alerts():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT sa.*, i.name as item_name
                FROM stock_alerts sa
                LEFT JOIN inventory_items i ON sa.item_id = i.id
            """
            cursor.execute(sql)
            items = cursor.fetchall()
                    
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@stock_alerts_bp.route('/<int:id>', methods=['GET'])
def get_alert(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT sa.*, i.name as item_name
                FROM stock_alerts sa
                LEFT JOIN inventory_items i ON sa.item_id = i.id
                WHERE sa.id = %s
            """
            cursor.execute(sql, (id,))
            item = cursor.fetchone()
            if not item: return jsonify({"success": False, "error": "Alert not found"}), 404
                
        return jsonify({"success": True, "data": item})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@stock_alerts_bp.route('', methods=['POST'])
def create_alert():
    data = request.get_json()
    if not data or 'item_id' not in data:
        return jsonify({"success": False, "error": "Missing required field: 'item_id'"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO stock_alerts 
                (item_id, sku, warehouse, current_stock, min_stock, alert_level, recommended_action) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data.get('item_id'),
                data.get('sku'),
                data.get('warehouse'),
                data.get('current_stock', 0),
                data.get('min_stock', 0),
                data.get('alert_level'),
                data.get('recommended_action')
            ))
            new_id = cursor.lastrowid
        return jsonify({"success": True, "data": {"id": new_id}, "message": "Alert created"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@stock_alerts_bp.route('/<int:id>', methods=['PUT'])
def update_alert(id):
    data = request.get_json()
    if not data: return jsonify({"success": False, "error": "No data provided"}), 400

    updates = []
    params = []
    for key, value in data.items():
        if key != 'id':
            updates.append(f"{key} = %s")
            params.append(value)
    
    if not updates: return jsonify({"success": False, "error": "No fields to update"}), 400
    params.append(id)
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = f"UPDATE stock_alerts SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(sql, tuple(params))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Alert not found"}), 404
        return jsonify({"success": True, "message": "Alert updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@stock_alerts_bp.route('/<int:id>', methods=['DELETE'])
def delete_alert(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM stock_alerts WHERE id = %s", (id,))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Alert not found"}), 404
        return jsonify({"success": True, "message": "Alert deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()
