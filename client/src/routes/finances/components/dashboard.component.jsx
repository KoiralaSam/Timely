import { FiPlus } from "react-icons/fi";
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

const Dashboard = ({ onAddExpenseClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <button
          onClick={onAddExpenseClick}
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
};

export default Dashboard;

