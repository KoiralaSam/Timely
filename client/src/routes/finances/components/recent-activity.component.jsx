import { useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { ExpenseContext } from "../../../contexts/expenseContext";

const API_BASE_URL = "http://localhost:8080/api/v1";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RecentActivity = () => {
  const { expenses, dispatchExpense } = useContext(ExpenseContext);
  const expensesList = expenses || [];

  const handleDeleteExpense = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to delete expenses");
        return;
      }

      const res = await axios.delete(`${API_BASE_URL}/expense/${id}`, {
        headers: {
          Authorization: authToken,
        },
      });

      console.log(res.data);

      if (res.status === 200) {
        dispatchExpense({ type: "DELETE_EXPENSE", payload: { id } });
      }
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to delete expense. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {expensesList.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-600 text-center">
              No expenses yet. Add your first expense to get started!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {expensesList.map((expense) => (
              <div
                key={expense.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Category Color Indicator */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{
                        backgroundColor: expense.category_color || "#607D8B",
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-sm font-medium text-gray-900"
                          style={{
                            color: expense.category_color || "#607D8B",
                          }}
                        >
                          {expense.category_name || "Unknown"}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${parseFloat(expense.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      {expense.description && (
                        <p className="text-sm text-gray-600 truncate">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <p className="text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </p>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
