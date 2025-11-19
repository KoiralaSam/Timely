import { FiUpload, FiX } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const API_BASE_URL_V1 = `${API_BASE_URL}/api/v1`;

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

const AddExpenseModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  receiptFile,
  receiptPreview,
  onFileChange,
  onExpenseAdded,
  fetchExpenses,
}) => {
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
        `${API_BASE_URL_V1}/expense/add`,
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

      // Call the callback to notify parent
      if (onExpenseAdded) {
        onExpenseAdded(response.data);
      }

      // Refresh expenses list
      fetchExpenses(authToken);

      alert("Expense added successfully!");

      // Reset form
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Green Header */}
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Add an expense</h2>
          <button
            onClick={onClose}
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
                onChange={onFormChange}
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
                onChange={onFormChange}
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
                onChange={onFormChange}
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
                onChange={onFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 space-y-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
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

          {/* Receipt Upload Section */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              or Upload receipt image to add expense
            </p>
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
                onChange={onFileChange}
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
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
