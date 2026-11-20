<div align="center">

# Nexus ERP — Inventory Predictor Dashboard

A full-stack inventory management system for manufacturing and distribution businesses — combining real-time stock tracking, procurement workflows, supplier management, and demand-forecasting visualizations in a single operational dashboard.

**React 19 · TypeScript · Vite · Tailwind CSS · Flask · MySQL**

</div>

---

## Overview

Nexus ERP is a 13-screen inventory operations dashboard built to demonstrate how a mid-sized business could unify inventory, procurement, sales, and supplier data into one system instead of tracking them across spreadsheets. It started as a UI/UX design build and was extended with a working Flask + MySQL REST API, turning it into a functioning full-stack application with live CRUD operations end to end.

**Why this project exists:** most student and portfolio ERP demos stop at the UI. This one connects the frontend to a real relational database via a REST API, covering the full loop — inventory levels update, purchase orders get created, stock alerts trigger — the way an actual internal tool would.

> **Note on "AI" forecasting:** the demand-forecasting and purchase-recommendation screens are driven by simulated seasonal data and randomized confidence scoring, not a trained machine-learning model. They're included to demonstrate UI/UX for a forecasting feature — see [Roadmap](#roadmap) for what a real implementation would need.

## Features

- **13 integrated screens** — dashboard, inventory, procurement, purchase orders, suppliers, sales, production & warehouse health, demand forecasting, purchase recommendations, stock alerts, advanced analytics, and report center
- **Live REST API backend** — Flask + PyMySQL powering full CRUD across 6 core modules, replacing the original mock data layer
- **Cross-page business workflows** — approving a purchase recommendation creates a PO; a stock alert can trigger a rush order; global search and warehouse filtering work across modules
- **Interactive data visualization** — Chart.js dashboards, warehouse heatmaps, and analytics breakdowns
- **Role-based login flow** — multi-company, multi-user demo authentication (`src/data/authData.ts`)
- **Consistent JSON API contract** — every endpoint returns `{ "success": bool, "data" | "error": ... }`

## Data Source by Screen

The 6 modules with a Flask API route are wired to the live database. Screens without a backend route yet still run on frontend mock data — this is intentional, not a bug:

| Screen | Data Source |
|---|---|
| Inventory Management | Live (MySQL via API) |
| Supplier Directory | Live (MySQL via API) |
| Purchase Orders | Live (MySQL via API) |
| Procurement Tracking | Live (MySQL via API) |
| Sales Performance | Live (MySQL via API) |
| Stock Alerts | Live (MySQL via API) |
| AI Demand Forecasting | Simulated (mock data) |
| Purchase Recommendations | Simulated (mock data) |
| Production & Warehouse Health | Simulated (mock data) |
| Advanced Analytics | Simulated (mock data) |
| Report Center | Simulated (mock data) |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7 |
| Charts | Chart.js, react-chartjs-2 |
| Backend | Python, Flask 3, Flask-CORS |
| Database | MySQL (via PyMySQL) |
| Tooling | oxlint, python-dotenv |

## Project Structure

```
Inventort Predict system/
├── src/                    # React frontend
│   ├── components/         # Layout, auth guard, shared UI
│   ├── context/            # App state & auth context
│   ├── data/                # Mock/demo data + TypeScript types
│   └── pages/                # 13 dashboard screens
├── backend/                 # Flask REST API
│   ├── routes/               # Blueprint per module (inventory, suppliers, POs, etc.)
│   ├── app.py                  # App entry point
│   ├── db.py                   # DB connection (env-configurable)
│   ├── schema.sql              # Table definitions + seed data
│   └── requirements.txt
└── public/assets/screens/  # UI screenshots
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- MySQL server (e.g. via [XAMPP](https://www.apachefriends.org/))

### 1. Database
1. Start MySQL (e.g. via XAMPP).
2. Open phpMyAdmin → **Import** → select `backend/schema.sql`.
   This creates the `nexus_erp` database, all 6 tables, and seed data.

### 2. Backend (Flask API)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
API runs at `http://127.0.0.1:5000`. Default config assumes a fresh XAMPP install (`root`, no password). To use different credentials, copy `backend/.env.example` to `backend/.env` and edit it.

### 3. Frontend (React)
```bash
npm install
npm run dev
```
App runs at `http://localhost:5173`.

### Build for production
```bash
npm run build
npm run preview
```

## API Reference

Base URL: `http://127.0.0.1:5000/api`

| Module | Endpoint |
|---|---|
| Inventory Items | `/inventory_items` |
| Suppliers | `/suppliers` |
| Purchase Orders | `/purchase_orders` |
| Procurement Requests | `/procurement_requests` |
| Sales Orders | `/sales_orders` |
| Stock Alerts | `/stock_alerts` |

Each module supports `GET` (list/single), `POST`, `PUT`, and `DELETE`, e.g.:
```bash
curl http://127.0.0.1:5000/api/inventory_items
curl -X POST http://127.0.0.1:5000/api/inventory_items \
  -H "Content-Type: application/json" \
  -d '{"code":"NEW-001","name":"New Item","category":"Misc","warehouse":"Main","stock":50,"min_stock":10,"max_stock":100,"unit_cost":25.50}'
```

## Roadmap

- [ ] Replace simulated forecasting with a real time-series model (e.g. Prophet or a simple ARIMA) trained on `sales_orders` history
- [ ] Add backend endpoints for forecasting, recommendations, warehouse health, analytics, and reports, and wire those screens to live data too
- [ ] JWT-based authentication instead of demo login
- [ ] Automated tests for API routes


---

Built by [Dishan Weeraman](https://github.com/Dishanweeraman)

