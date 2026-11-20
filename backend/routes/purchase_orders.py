from flask import Blueprint, request, jsonify
from db import get_db_connection

purchase_orders_bp = Blueprint('purchase_orders', __name__)

@purchase_orders_bp.route('', methods=['GET'])
def get_all_orders():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # We join with suppliers and inventory_items to get helpful names
            sql = """
                SELECT po.*, s.name as supplier_name, i.name as item_name
                FROM purchase_orders po
                LEFT JOIN suppliers s ON po.supplier_id = s.id
                LEFT JOIN inventory_items i ON po.item_id = i.id
            """
            cursor.execute(sql)
            items = cursor.fetchall()
            
            for item in items:
                if item.get('order_date'): item['order_date'] = item['order_date'].strftime('%Y-%m-%d')
                if item.get('delivery_date'): item['delivery_date'] = item['delivery_date'].strftime('%Y-%m-%d')
                    
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@purchase_orders_bp.route('/<int:id>', methods=['GET'])
def get_order(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT po.*, s.name as supplier_name, i.name as item_name
                FROM purchase_orders po
                LEFT JOIN suppliers s ON po.supplier_id = s.id
                LEFT JOIN inventory_items i ON po.item_id = i.id
                WHERE po.id = %s
            """
            cursor.execute(sql, (id,))
            item = cursor.fetchone()
            if not item: return jsonify({"success": False, "error": "Order not found"}), 404
                
            if item.get('order_date'): item['order_date'] = item['order_date'].strftime('%Y-%m-%d')
            if item.get('delivery_date'): item['delivery_date'] = item['delivery_date'].strftime('%Y-%m-%d')
                
        return jsonify({"success": True, "data": item})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@purchase_orders_bp.route('', methods=['POST'])
def create_order():
    data = request.get_json()
    if not data or 'po_number' not in data:
        return jsonify({"success": False, "error": "Missing required field: 'po_number'"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO purchase_orders 
                (po_number, supplier_id, item_id, quantity, unit_price, order_date, delivery_date, status) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data.get('po_number'),
                data.get('supplier_id'),
                data.get('item_id'),
                data.get('quantity', 0),
                data.get('unit_price', 0.00),
                data.get('order_date'),
                data.get('delivery_date'),
                data.get('status', 'Pending')
            ))
            new_id = cursor.lastrowid
        return jsonify({"success": True, "data": {"id": new_id}, "message": "Order created"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@purchase_orders_bp.route('/<int:id>', methods=['PUT'])
def update_order(id):
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
            sql = f"UPDATE purchase_orders SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(sql, tuple(params))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Order not found"}), 404
        return jsonify({"success": True, "message": "Order updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@purchase_orders_bp.route('/<int:id>', methods=['DELETE'])
def delete_order(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM purchase_orders WHERE id = %s", (id,))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Order not found"}), 404
        return jsonify({"success": True, "message": "Order deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()
