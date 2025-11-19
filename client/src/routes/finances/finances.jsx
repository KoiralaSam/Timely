import { useState, useContext, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiLayout, FiActivity, FiCreditCard } from "react-icons/fi";
import axios from "axios";
import { ExpenseContext } from "../../contexts/expenseContext";
import Dashboard from "./components/dashboard.component";
import RecentActivity from "./components/recent-activity.component";
import Banks from "./components/banks.component";
import AddExpenseModal from "./components/add-expense-modal.component";

const API_BASE_URL = "http://localhost:8080/api/v1";

const Finances = () => {
  const { expenses, dispatchExpense } = useContext(ExpenseContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Check for section query parameter on mount
  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "banks") {
      setActiveSection("banks");
      // Clean up the query parameter
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
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

  // Debug: Log expenses from context
  useEffect(() => {
    console.log("Expenses from context:", expenses);
  }, [expenses]);

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

  const handleExpenseAdded = (responseData) => {
    // Add expense to context
    if (responseData?.expense) {
      dispatchExpense({
        type: "ADD_EXPENSE",
        payload: responseData.expense,
      });
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
        {activeSection === "dashboard" && (
          <Dashboard onAddExpenseClick={() => setIsModalOpen(true)} />
        )}
        {activeSection === "activity" && <RecentActivity />}
        {activeSection === "banks" && <Banks />}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onFormChange={handleFormChange}
        receiptFile={receiptFile}
        receiptPreview={receiptPreview}
        onFileChange={handleFileChange}
        onExpenseAdded={handleExpenseAdded}
        fetchExpenses={fetchExpenses}
      />
    </div>
  );
};

export default Finances;
