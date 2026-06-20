# Ledger — Expense Tracker Frontend

A dark-themed React frontend for your Expense Tracker API. Built with Vite,
plain CSS, and Recharts.

- **Entries** tab — table of all expenses (no ID column), delete button per
  row, "Add entry" button that opens a form modal.
- **Insights** tab — pie chart (spend by category, current month), bar chart
  (spend by month, across all recorded months), line chart (spend by day,
  current month). Month numbers from the API (1, 2, 3...) are converted to
  names (Jan, Feb, Mar...) on the frontend.

## 1. Install dependencies

```bash
npm install
```

## 2. Connect to your backend

This app talks to your FastAPI backend over plain `fetch`. Set the backend's
base URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

Change this to wherever your API is actually running (e.g.
`https://api.yourdomain.com`). There's no `/api/v1` suffix here -- that's
already included in each request path in `src/api.js`.

After editing `.env`, restart the dev server (Vite only reads `.env` at
startup).

### Enable CORS on the backend

Since the frontend (Vite dev server, e.g. `http://localhost:5173`) and the
backend (e.g. `http://localhost:8000`) run on different ports, your FastAPI
backend needs CORS enabled or the browser will block requests. Add this to
your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # add your prod frontend URL too
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 3. Run it

```bash
npm run dev
```

Visit the URL Vite prints (usually `http://localhost:5173`).

## 4. Build for production

```bash
npm run build
```

Output goes to `dist/` -- serve it with any static host (Nginx, Vercel,
Netlify, etc.). Remember to set `VITE_API_BASE_URL` for that environment
before building (Vite bakes env vars in at build time).

## Notes on the API contract

- `GET /api/v1/expenses/` -- populates the Entries table.
- `POST /api/v1/expenses/` -- used by "Add entry". Sends
  `{ amount, category, date, description }`.
- `DELETE /api/v1/expenses/{id}` -- used by each row's Delete button.
- `GET /api/v1/analytics/current-month/categories` -- pie chart.
- `GET /api/v1/analytics/monthly` -- bar chart. Expects `groupexpences` items
  shaped `{ month, total }`; `month` is mapped 1->Jan ... 12->Dec in
  `src/utils/months.js`.
- `GET /api/v1/analytics/current-month/daily` -- line chart. Expects
  `groupexpences` items shaped `{ day, total }`.

If your backend's monthly endpoint already returns names instead of numbers,
`monthName()` in `src/utils/months.js` will just pass the string through
unchanged -- no breakage either way.

The currency symbol shown in the table (`$`) is set at the top of
`src/components/ExpenseTable.jsx` -- change the `CURRENCY` constant if you
need something else.
