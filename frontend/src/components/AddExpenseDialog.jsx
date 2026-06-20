import { useState } from "react";

const COMMON_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Travel",
  "Other",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddExpenseDialog({ expense, onClose, onSubmit }) {
  const isEdit = Boolean(expense);
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [category, setCategory] = useState(expense ? expense.category : "");
  const [date, setDate] = useState(expense ? expense.date : todayISO());
  const [description, setDescription] = useState(
    expense ? expense.description || "" : ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        amount: numericAmount,
        category: category.trim(),
        date,
        description: description.trim() || null,
      });
    } catch (err) {
      setError(err.message || "Could not save the entry.");
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <h2>{isEdit ? "Edit entry" : "New entry"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              list="category-options"
              placeholder="e.g. Food"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="category-options">
              {COMMON_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              rows={2}
              placeholder="Notes about this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <div className="field-error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update entry" : "Save entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
