from flask import Blueprint, request, jsonify
from db import get_db_connection

procurement_requests_bp = Blueprint('procurement_requests', __name__)

@procurement_requests_bp.route('', methods=['GET'])
def get_all_requests():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT pr.*, s.name as supplier_name
                FROM procurement_requests pr
                LEFT JOIN suppliers s ON pr.supplier_id = s.id
            """
            cursor.execute(sql)
            items = cursor.fetchall()
            
            for item in items:
                if item.get('request_date'): item['request_date'] = item['request_date'].strftime('%Y-%m-%d')
                if item.get('needed_by'): item['needed_by'] = item['needed_by'].strftime('%Y-%m-%d')
                    
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@procurement_requests_bp.route('/<int:id>', methods=['GET'])
def get_request(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT pr.*, s.name as supplier_name
                FROM procurement_requests pr
                LEFT JOIN suppliers s ON pr.supplier_id = s.id
                WHERE pr.id = %s
            """
            cursor.execute(sql, (id,))
            item = cursor.fetchone()
            if not item: return jsonify({"success": False, "error": "Request not found"}), 404
                
            if item.get('request_date'): item['request_date'] = item['request_date'].strftime('%Y-%m-%d')
            if item.get('needed_by'): item['needed_by'] = item['needed_by'].strftime('%Y-%m-%d')
                
        return jsonify({"success": True, "data": item})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@procurement_requests_bp.route('', methods=['POST'])
def create_request():
    data = request.get_json()
    if not data or 'pr_number' not in data:
        return jsonify({"success": False, "error": "Missing required field: 'pr_number'"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO procurement_requests 
                (pr_number, requested_by, department, supplier_id, request_date, needed_by, status, value) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data.get('pr_number'),
                data.get('requested_by'),
                data.get('department'),
                data.get('supplier_id'),
                data.get('request_date'),
                data.get('needed_by'),
                data.get('status', 'Pending'),
                data.get('value', 0.00)
            ))
            new_id = cursor.lastrowid
        return jsonify({"success": True, "data": {"id": new_id}, "message": "Request created"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@procurement_requests_bp.route('/<int:id>', methods=['PUT'])
def update_request(id):
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
            sql = f"UPDATE procurement_requests SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(sql, tuple(params))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Request not found"}), 404
        return jsonify({"success": True, "message": "Request updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()

@procurement_requests_bp.route('/<int:id>', methods=['DELETE'])
def delete_request(id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM procurement_requests WHERE id = %s", (id,))
            if cursor.rowcount == 0: return jsonify({"success": False, "error": "Request not found"}), 404
        return jsonify({"success": True, "message": "Request deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()
