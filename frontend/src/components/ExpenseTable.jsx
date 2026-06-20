const CURRENCY = "$"; // change to your currency symbol

function formatAmount(n) {
  return `${CURRENCY}${Number(n).toFixed(2)}`;
}

function formatDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (!expenses.length) {
    return (
      <div className="ledger-table-wrap">
        <div className="empty-state">
          <div className="glyph">—</div>
          No entries yet. Add your first expense to start the ledger.
        </div>
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="ledger-table-wrap">
      <table className="ledger">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th className="num">Amount</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((expense) => (
            <tr key={expense.id}>
              <td className="date">{formatDate(expense.date)}</td>
              <td>
                <span className="cat-pill">{expense.category}</span>
              </td>
              <td className="desc">{expense.description || "—"}</td>
              <td className="amount">{formatAmount(expense.amount)}</td>
              <td className="row-actions">
                <button
                  className="row-edit"
                  onClick={() => onEdit(expense)}
                  aria-label={`Edit entry from ${formatDate(expense.date)}`}
                  title="Edit entry"
                >
                  Edit
                </button>
                <button
                  className="row-delete"
                  onClick={() => onDelete(expense.id)}
                  aria-label={`Delete entry from ${formatDate(expense.date)}`}
                  title="Delete entry"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
