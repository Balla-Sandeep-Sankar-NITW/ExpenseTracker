const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ? JSON.stringify(body.detail) : detail;
    } catch {
      // ignore parse errors, fall back to statusText
    }
    throw new Error(`${res.status} ${detail}`);
  }

  // 204 / empty body safety
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  getAllExpenses: () => request("/api/v1/expenses/"),
  createExpense: (payload) =>
    request("/api/v1/expenses/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateExpense: (id, payload) =>
    request(`/api/v1/expenses/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteExpense: (id) =>
    request(`/api/v1/expenses/${id}`, { method: "DELETE" }),

  getMonthly: () => request("/api/v1/analytics/monthly"),
  getDaily: () => request("/api/v1/analytics/current-month/daily"),
  getCategories: () => request("/api/v1/analytics/current-month/categories"),
};
