import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { UserContext } from "../contexts/userContext"; // adjust path as needed

const HoursChart = () => {
  const { currentUser } = useContext(UserContext);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:3000/time", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Group & sum hours by jobSite
      const grouped = {};
      res.data.forEach((entry) => {
        if (entry.jobSite && typeof entry.hours === "number") {
          grouped[entry.jobSite] = (grouped[entry.jobSite] || 0) + entry.hours;
        }
      });

      const formatted = Object.entries(grouped).map(([jobSite, hours]) => ({
        jobSite,
        hours: parseFloat(hours.toFixed(2)),
      }));

      setData(formatted);
    } catch (error) {
      console.error("Failed to fetch time entries:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.token) fetchData();
  }, [currentUser]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Hours Worked by Job Site
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jobSite" />
          <YAxis
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="hours" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursChart;
