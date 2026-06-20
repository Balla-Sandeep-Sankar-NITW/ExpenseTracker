import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ExpenseTable from "./components/ExpenseTable";
import AddExpenseDialog from "./components/AddExpenseDialog";
import Insights from "./components/Insights";
import { api } from "./api";

export default function App() {
  const [view, setView] = useState("entries");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadExpenses() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAllExpenses();
      setExpenses(data || []);
    } catch (err) {
      setError(err.message || "Could not load expenses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleSave(payload) {
    if (editingExpense) {
      await api.updateExpense(editingExpense.id, payload);
    } else {
      await api.createExpense(payload);
    }
    closeDialog();
    loadExpenses();
  }

  function openAddDialog() {
    setEditingExpense(null);
    setDialogOpen(true);
  }

  function openEditDialog(expense) {
    setEditingExpense(expense);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingExpense(null);
  }

  async function handleDelete(id) {
    const previous = expenses;
    setExpenses(previous.filter((e) => e.id !== id));
    try {
      await api.deleteExpense(id);
    } catch (err) {
      setExpenses(previous);
      setError(err.message || "Could not delete that entry.");
    }
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="app-shell">
      <Navbar view={view} onChange={setView} />

      {view === "entries" && (
        <>
          <div className="section-header">
            <div>
              <h1>Entries</h1>
              <div className="meta">
                {expenses.length} record{expenses.length === 1 ? "" : "s"} · total{" "}
                {total.toFixed(2)}
              </div>
            </div>
            <button className="btn btn-primary" onClick={openAddDialog}>
              + Add entry
            </button>
          </div>

          {error && <div className="state-banner error">{error}</div>}

          {loading ? (
            <div className="state-banner">Loading entries…</div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      {view === "insights" && (
        <>
          <div className="section-header">
            <div>
              <h1>Insights</h1>
              <div className="meta">Spending broken down a few ways</div>
            </div>
          </div>
          <Insights />
        </>
      )}

      {dialogOpen && (
        <AddExpenseDialog
          expense={editingExpense}
          onClose={closeDialog}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
