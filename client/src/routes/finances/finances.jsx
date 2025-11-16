import { useState, useContext, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiPlus,
  FiUpload,
  FiX,
  FiLayout,
  FiActivity,
  FiCreditCard,
} from "react-icons/fi";
import axios from "axios";
import { ExpenseContext } from "../../contexts/expenseContext";

const API_BASE_URL = "http://localhost:8080/api/v1";

// Dummy data for charts
const categoryExpenseData = [
  { name: "Grocery", value: 450, color: "#4CAF50" },
  { name: "Food", value: 380, color: "#FF5733" },
  { name: "Shopping", value: 520, color: "#9C27B0" },
  { name: "Education", value: 280, color: "#2196F3" },
  { name: "Health", value: 320, color: "#F44336" },
  { name: "Entertainment", value: 180, color: "#9C27B0" },
  { name: "Transportation", value: 250, color: "#2196F3" },
  { name: "Other", value: 150, color: "#607D8B" },
];

const monthlySpendingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1500 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 1400 },
  { month: "May", amount: 2000 },
  { month: "Jun", amount: 1600 },
];

// Dummy categories for now
const expenseCategories = [
  { id: 1, name: "Grocery", color: "#4CAF50" },
  { id: 2, name: "Food", color: "#FF5733" },
  { id: 3, name: "Shopping", color: "#9C27B0" },
  { id: 4, name: "Education", color: "#2196F3" },
  { id: 5, name: "Health", color: "#F44336" },
  { id: 6, name: "Entertainment", color: "#9C27B0" },
  { id: 7, name: "Transportation", color: "#2196F3" },
  { id: 8, name: "Other", color: "#607D8B" },
];

const Finances = () => {
  const { expenses, dispatchExpense } = useContext(ExpenseContext);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Debug: Log expenses from context
  useEffect(() => {
    console.log("Expenses from context:", expenses);
  }, [expenses]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch expenses from backend
  const fetchExpenses = useCallback(
    async (token) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/expense/list`, {
          headers: {
            Authorization: token,
          },
        });
        const apiExpenses = res.data?.expenses || [];
        console.log("apiExpenses", apiExpenses);
        dispatchExpense({ type: "SET_EXPENSES", payload: apiExpenses });
      } catch (error) {
        console.error(
          "Error fetching expenses:",
          error.response?.data || error.message
        );
      }
    },
    [dispatchExpense]
  );

  // Fetch expenses on mount and when switching to activity section
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return;
    }

    if (activeSection === "activity") {
      fetchExpenses(authToken);
    }
  }, [activeSection, fetchExpenses]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category_id" || name === "amount"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Please log in to add expenses");
      return;
    }

    try {
      // Convert date string (YYYY-MM-DD) to ISO datetime format (RFC3339)
      const dateObj = new Date(formData.date);
      const isoDateString = dateObj.toISOString();

      const expensePayload = {
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: isoDateString,
      };

      const response = await axios.post(
        `${API_BASE_URL}/expense/add`,
        expensePayload,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );

      // If receipt is uploaded, handle it separately (for now just log it)
      if (receiptFile) {
        console.log("Receipt file uploaded:", receiptFile.name);
        // TODO: Upload receipt to backend when endpoint is available
      }

      console.log("Expense added:", response.data);

      // Add expense to context
      if (response.data?.expense) {
        dispatchExpense({
          type: "ADD_EXPENSE",
          payload: response.data.expense,
        });
      }

      // Refresh expenses list
      fetchExpenses(authToken);

      alert("Expense added successfully!");

      // Reset form
      setFormData({
        category_id: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setReceiptFile(null);
      setReceiptPreview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReceiptFile(null);
    setReceiptPreview(null);
    setFormData({
      category_id: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={18} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Expenses */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryExpenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Monthly Spending */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderRecentActivity = () => {
    const expensesList = expenses || [];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Recent Activity
        </h2>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Category Color Indicator */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
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

                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm text-gray-500">
                        {formatDate(expense.date)}
                      </p>
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

  const renderBanks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Banks</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Bank accounts will be displayed here...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 w-full h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Finances</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === "dashboard"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiLayout size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveSection("activity")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === "activity"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiActivity size={20} />
            <span className="font-medium">Recent Activity</span>
          </button>
          <button
            onClick={() => setActiveSection("banks")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === "banks"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCreditCard size={20} />
            <span className="font-medium">Banks</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "activity" && renderRecentActivity()}
        {activeSection === "banks" && renderBanks()}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Green Header */}
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Add an expense
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form
                onSubmit={handleSubmitExpense}
                className="space-y-4"
                id="expense-form"
              >
                {/* Category */}
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    <option value="">Select a category</option>
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="Enter expense description..."
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Receipt Upload */}
                <div>
                  <label
                    htmlFor="receipt"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Receipt (Optional)
                  </label>
                  <div className="space-y-2">
                    <label
                      htmlFor="receipt"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <FiUpload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {receiptFile ? receiptFile.name : "Choose image file"}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {receiptPreview && (
                      <div className="mt-2">
                        <img
                          src={receiptPreview}
                          alt="Receipt preview"
                          className="max-w-full h-32 object-contain border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="expense-form"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
