from flask import Flask, jsonify
from flask_cors import CORS

# Import route blueprints
from routes.inventory import inventory_bp
from routes.suppliers import suppliers_bp
from routes.purchase_orders import purchase_orders_bp
from routes.procurement_requests import procurement_requests_bp
from routes.sales_orders import sales_orders_bp
from routes.stock_alerts import stock_alerts_bp

app = Flask(__name__)
# Enable CORS for all domains so the Vite frontend can access it without issues
CORS(app)

# Register blueprints (routes)
app.register_blueprint(inventory_bp, url_prefix='/api/inventory_items')
app.register_blueprint(suppliers_bp, url_prefix='/api/suppliers')
app.register_blueprint(purchase_orders_bp, url_prefix='/api/purchase_orders')
app.register_blueprint(procurement_requests_bp, url_prefix='/api/procurement_requests')
app.register_blueprint(sales_orders_bp, url_prefix='/api/sales_orders')
app.register_blueprint(stock_alerts_bp, url_prefix='/api/stock_alerts')

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "success": True,
        "message": "Welcome to the Nexus ERP Backend API",
        "endpoints": [
            "/api/inventory_items",
            "/api/suppliers",
            "/api/purchase_orders",
            "/api/procurement_requests",
            "/api/sales_orders",
            "/api/stock_alerts"
        ]
    })

# Global error handler for 404
@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Resource not found"}), 404

# Global error handler for 500
@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error"}), 500

if __name__ == '__main__':
    # Run the server in debug mode for easier development
    app.run(debug=True, port=5000)
