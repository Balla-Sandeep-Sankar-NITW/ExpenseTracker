# 💸 Expense Tracker

A full-stack expense tracking app built as a hands-on practice project for
**FastAPI**, **PostgreSQL**, and **Docker** — paired with a **React** frontend
for visualizing and managing expenses.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)

---

## 📖 About

This project started as a way to get hands-on with a backend stack I hadn't
combined before: a **FastAPI** REST API backed by **PostgreSQL** (hosted on
[Neon](https://neon.tech)), containerized with **Docker**, with a separate
**React** frontend consuming the API over HTTP.

It's intentionally a small, well-scoped domain (track expenses, see where the
money goes) so the focus stays on the stack and the plumbing — routing,
validation, database access, containerization, CORS, and a working frontend
on top of it — rather than the problem domain itself.

## ✨ Features

- **CRUD on expenses** — create, list, update, and delete expense records
- **Filtering** — fetch expenses by year, month, day, or category
- **Analytics endpoints** — pre-aggregated spend by month, by day (current
  month), and by category (current month)
- **Auto-generated API docs** via FastAPI's Swagger UI (`/docs`) and ReDoc
  (`/redoc`)
- **React dashboard** with:
  - a table of all expenses with add / edit / delete
  - a pie chart of spend by category
  - a bar chart of spend by month
  - a line chart of spend by day (current month)
- **Dockerized** backend and frontend, orchestrated with Docker Compose
- **Managed Postgres** via Neon — no local database container to babysit

## 🏗️ Tech stack

| Layer        | Technology                                  |
| ------------ | -------------------------------------------- |
| Backend      | FastAPI, Python, Uvicorn                     |
| Database     | PostgreSQL ([Neon](https://neon.tech), serverless) |
| Frontend     | React, Vite, Recharts                        |
| Containers   | Docker, Docker Compose                       |
| API docs     | OpenAPI / Swagger UI                         |

## 📂 Project structure

```
expense-tracker/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── expense.py        # Expense CRUD APIs
│   │   │   └── analytics.py      # Analytics endpoints
│   │   ├── database/
│   │   │   └── db.py             # Database connection
│   │   ├── models/
│   │   │   └── expense.py        # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── expense.py        # Pydantic schemas
│   │   │   └── analytics.py      # Analytics response schemas
│   │   ├── config.py             # Application settings
│   │   └── main.py               # FastAPI entry point
│   ├── .env
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AddExpenseDialog.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── Insights.jsx
│   │   │   └── Navbar.jsx
│   │   ├── utils/
│   │   │   ├── api.js            
│   │   │   └── months.js         
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```


## 🚀 Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A [Neon](https://neon.tech) Postgres project (free tier works fine) and its
  connection string
- Node.js 18+ and Python 3.11+ if you want to run things outside Docker

### 1. Clone the repo

```bash
git clone https://github.com/Balla-Sandeep-Sankar-NITW/ExpenseTracker.git
cd expense-tracker
```

### 2. Configure environment variables

**Backend** — `backend/.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<dbname>?sslmode=require
APP_NAME=Expense Tracker
APP_VERSION=1.0.0
```

**Frontend** — `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Get the `DATABASE_URL` from your Neon project dashboard — it's the
> connection string under **Connection Details**. Keep `sslmode=require`,
> Neon needs it.

### 3. Run with Docker Compose

```bash
docker compose up --build
```

This brings up:

- **backend** → FastAPI app on [http://localhost:8000](http://localhost:8000)
  (connects out to Neon — no local DB container needed)
- **frontend** → React app on [http://localhost:5173](http://localhost:5173)

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the
interactive Swagger UI, and [http://localhost:5173](http://localhost:5173)
for the dashboard.

To stop everything:

```bash
docker compose down
```

### Running without Docker (optional)

**Backend:**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

> Whichever way you run the backend, make sure CORS allows your frontend's
> origin (`http://localhost:5173` by default) — see `app.add_middleware(CORSMiddleware, ...)`
> in `main.py`.

## 📡 API reference

Base path: `/api/v1`

| Method | Endpoint                          | Description                          |
| ------ | ---------------------------------- | ------------------------------------- |
| GET    | `/expenses/`                      | List all expenses                     |
| POST   | `/expenses/`                      | Create a new expense                  |
| PUT    | `/expenses/update/{id}`           | Update an existing expense            |
| DELETE | `/expenses/{id}`                  | Delete an expense                     |
| GET    | `/expenses/year/{y}`              | Expenses for a given year             |
| GET    | `/expenses/month/{m}`             | Expenses for a given month            |
| GET    | `/expenses/day/{d}`               | Expenses for a given day              |
| GET    | `/expenses/category/{cat}`        | Expenses for a given category         |
| GET    | `/analytics/monthly`              | Total spend grouped by month          |
| GET    | `/analytics/current-month/daily`  | Total spend grouped by day (this month) |
| GET    | `/analytics/current-month/categories` | Total spend grouped by category (this month) |

Full request/response schemas are available at `/docs` once the backend is
running, generated straight from the FastAPI route definitions.

## 🖥️ Screenshots

<img width="2097" height="1447" alt="image" src="https://github.com/user-attachments/assets/29521fca-ef85-463f-a78b-fc3da71d9563" />
<img width="2089" height="1752" alt="image" src="https://github.com/user-attachments/assets/6c66d74b-92ba-4328-9c9a-8c359c9aef88" />



```md
![Entries view](docs/screenshot-entries.png)
![Insights view](docs/screenshot-insights.png)
```

## 🧠 What I practiced here

- Structuring a FastAPI app with routers, Pydantic schemas, and a clean
  separation between API and DB layers
- Connecting FastAPI to a managed Postgres instance (Neon) instead of a local
  database
- Writing aggregate queries (group-by month/day/category) and shaping the
  response for a frontend
- Multi-container Docker Compose setups (backend + frontend, talking to an
  external managed DB)
- Hooking up a React frontend to a self-built API: CORS, environment-based
  config, CRUD forms, and chart visualizations with Recharts

## 📝 License

This project is for learning purposes. Feel free to fork it, break it, and
use it as a reference for your own practice.
