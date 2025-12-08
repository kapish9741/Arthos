import { useState, useEffect } from "react";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/expenses', {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setIsAddModalOpen(false);
      setNewExpense({ title: "", amount: "", category: "Food", date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  }

  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto h-full relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <p className="text-neutral-400">Total Spent</p>
            <p className="text-2xl font-bold text-white">
              ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <p className="text-neutral-400">Budget</p>
            <p className="text-2xl font-bold text-white">$1,000.00</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <p className="text-neutral-400">Remaining</p>
            <p className="text-2xl font-bold text-green-400">
              ${(1000 - expenses.reduce((acc, curr) => acc + curr.amount, 0)).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/50">
              <tr>
                <th className="p-4 text-neutral-400 font-medium">Title</th>
                <th className="p-4 text-neutral-400 font-medium">Category</th>
                <th className="p-4 text-neutral-400 font-medium">Date</th>
                <th className="p-4 text-neutral-400 font-medium text-right">Amount</th>
                <th className="p-4 text-neutral-400 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-neutral-700/30 transition-colors">
                  <td className="p-4 text-white">{expense.title}</td>
                  <td className="p-4 text-neutral-300">
                    <span className="px-2 py-1 rounded bg-neutral-700 text-xs text-white">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-300">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-4 text-white font-medium text-right">${expense.amount.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No expenses found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl border border-neutral-700 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Expense</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-green-500"
                  placeholder="e.g. Grocery Shopping"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Amount ($)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-green-500"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-green-500"
                  >
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Health</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg mt-4 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ExpensesPage;
