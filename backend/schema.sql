CREATE DATABASE IF NOT EXISTS nexus_erp;
USE nexus_erp;

DROP TABLE IF EXISTS stock_alerts;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS procurement_requests;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS suppliers;

-- 1. Inventory Items
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    warehouse VARCHAR(100),
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 0,
    unit_cost DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 2. Suppliers
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    category VARCHAR(100),
    lead_time INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    last_delivery DATE,
    active_orders INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 3. Purchase Orders
CREATE TABLE purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INT,
    item_id INT,
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10, 2) DEFAULT 0.00,
    order_date DATE,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE SET NULL
);

-- 4. Procurement Requests
CREATE TABLE procurement_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_number VARCHAR(50) NOT NULL UNIQUE,
    requested_by VARCHAR(100),
    department VARCHAR(100),
    supplier_id INT,
    request_date DATE,
    needed_by DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    value DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- 5. Sales Orders
CREATE TABLE sales_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer VARCHAR(255),
    product VARCHAR(255),
    quantity INT DEFAULT 0,
    value DECIMAL(10, 2) DEFAULT 0.00,
    order_date DATE,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 6. Stock Alerts
CREATE TABLE stock_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    sku VARCHAR(50),
    warehouse VARCHAR(100),
    current_stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    alert_level VARCHAR(50),
    recommended_action TEXT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- SEED DATA
-- --------------------------------------------------------

-- Inventory Items Seed
INSERT INTO inventory_items (code, name, category, warehouse, stock, min_stock, max_stock, unit_cost, status) VALUES
('ST-BOLT-M12', 'Stainless Steel Bolt M12', 'Hardware', 'Main Hub', 4200, 500, 8000, 2.40, 'In Stock'),
('CP-WIR-500', 'Copper Wire 500m Roll', 'Electrical', 'Main Hub', 890, 200, 2000, 45.00, 'In Stock'),
('EL-MOT-25HP', 'Electric Motor 25HP', 'Motors', 'Remote 1', 42, 20, 100, 1250.00, 'Low Stock'),
('BR-6204-Z', 'Ball Bearing 6204-Z', 'Hardware', 'Main Hub', 0, 100, 5000, 8.50, 'Out of Stock'),
('PL-ALY-304', 'Alloy Plate 304 SS', 'Raw Materials', 'Remote 1', 156, 50, 500, 320.00, 'In Stock'),
('NV-500-PROC', 'NV-500 Processors', 'Electronics', 'Main Hub', 12, 50, 200, 890.00, 'Critical'),
('SSD-1TB-NVME', 'SSD 1TB NVMe', 'Electronics', 'Remote 1', 28, 40, 150, 95.00, 'Low Stock'),
('TN-HP-410A', 'Toner HP 410A', 'Consumables', 'Main Hub', 65, 30, 200, 78.00, 'In Stock'),
('FB-CBL-100M', 'Fiber Cable 100m', 'Electrical', 'Remote 1', 8, 15, 80, 210.00, 'Low Stock'),
('GR-CON-500', 'Graphene Conductors', 'Advanced', 'Main Hub', 200, 50, 400, 45.00, 'In Stock');

-- Suppliers Seed
INSERT INTO suppliers (name, contact, category, lead_time, rating, last_delivery, active_orders, status) VALUES
('Global Ironworks', 'John Smith', 'Raw Materials', 5, 4.8, '2026-01-12', 12, 'Active'),
('Precision Dynamics', 'Emma Davis', 'Components', 3, 4.6, '2026-01-14', 8, 'Active'),
('ChemSupply Co.', 'Robert Lee', 'Chemicals', 7, 4.2, '2026-01-08', 5, 'Active'),
('Apex Tooling', 'Anna Kowalski', 'Tools', 4, 4.9, '2026-01-15', 15, 'Active'),
('Global Logistics Inc.', 'David Kim', 'Electronics', 6, 4.5, '2026-01-13', 10, 'Active'),
('Vertex Microchips', 'Sophie Martin', 'Electronics', 8, 4.7, '2026-01-11', 6, 'Active');

-- Purchase Orders Seed
INSERT INTO purchase_orders (po_number, supplier_id, item_id, quantity, unit_price, order_date, delivery_date, status) VALUES
('PO-5501', 5, 6, 420, 200.48, '2026-01-05', '2026-01-20', 'Shipped'),
('PO-5502', 6, 1, 1200, 10.38, '2026-01-08', '2026-01-25', 'Processing'),
('PO-5503', 2, 5, 80, 1950.00, '2026-01-02', '2026-01-15', 'Delayed'),
('PO-5504', 3, 2, 500, 12.50, '2026-01-10', '2026-01-18', 'In Transit'),
('PO-5505', 4, 4, 2000, 8.50, '2026-01-12', '2026-01-28', 'Pending'),
('PO-88219-X', 5, 6, 420, 200.48, '2026-01-14', '2026-01-22', 'Shipped'),
('PO-88220-Y', 6, 1, 1200, 10.38, '2026-01-15', '2026-01-26', 'Processing'),
('PO-88221-Z', 2, 5, 80, 1950.00, '2026-01-11', '2026-01-19', 'Delayed');

-- Procurement Requests Seed
INSERT INTO procurement_requests (pr_number, requested_by, department, supplier_id, request_date, needed_by, status, value) VALUES
('PR-9021', 'Sarah Chen', 'Production', 1, '2026-01-14', '2026-01-28', 'Approved', 45000.00),
('PR-9018', 'Mike Torres', 'Maintenance', 2, '2026-01-13', '2026-01-25', 'Pending', 12800.00),
('PR-9012', 'Lisa Park', 'Warehouse', 3, '2026-01-12', '2026-01-22', 'Approved', 6200.00),
('PR-8945', 'James Wilson', 'Engineering', 4, '2026-01-10', '2026-01-20', 'Processing', 28500.00);

-- Sales Orders Seed
INSERT INTO sales_orders (order_number, customer, product, quantity, value, order_date, status) VALUES
('ORD-2024-8841', 'Acme Manufacturing', 'Electric Motor 25HP', 12, 15000.00, '2026-01-15', 'Shipped'),
('ORD-2024-8842', 'TechFlow Industries', 'Control Panel Unit', 8, 22400.00, '2026-01-14', 'Processing'),
('ORD-2024-8843', 'BuildRight Corp', 'Copper Wire 500m', 50, 2250.00, '2026-01-13', 'Completed'),
('ORD-2024-8844', 'Global Steel Ltd', 'Alloy Plate 304 SS', 25, 8000.00, '2026-01-12', 'Processing');

-- Stock Alerts Seed
INSERT INTO stock_alerts (item_id, sku, warehouse, current_stock, min_stock, alert_level, recommended_action) VALUES
(6, 'NV-500-PROC', 'Main Hub', 12, 50, 'Critical', 'Rush PO'),
(7, 'SSD-1TB-NVME', 'Remote 1', 28, 40, 'High', 'Review Quote'),
(8, 'TN-HP-410A', 'Main Hub', 65, 30, 'Medium', 'Schedule Reorder'),
(9, 'FB-CBL-100M', 'Remote 1', 8, 15, 'Low', 'Monitor'),
(4, 'BR-6204-Z', 'Main Hub', 0, 100, 'Critical', 'Emergency PO');
