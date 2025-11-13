import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import Clock from "../../components/home.components/clock.component";
import axios from "axios";

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [type, setType] = useState(true);

  const saveClockEntry = async (entry, token) => {
    try {
      const res = await axios({
        url: "http://localhost:3000/time",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: entry,
      });
      return res.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const patchModEntry = async (entry, token) => {
    try {
      const { _id, clockOut } = entry;
      console.log(_id);
      const res = await axios({
        url: `http://localhost:3000/time/${_id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { clockOut },
      });
      console.log("Clock Entry Saved:", res.data);
      return res.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const fetchEntries = async (token) => {
    try {
      const res = await axios({
        url: "http://localhost:3000/time",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", res.data); // Log the API response
      return Array.isArray(res.data)
        ? res.data.filter((entry) => entry && entry.clockIn)
        : []; // Ensure it returns an array
    } catch (error) {
      console.error(error.response?.data || error.message);
      return []; // Return an empty array on error
    }
  };

  const handleClockIn = async (type) => {
    const now = new Date();
    const authToken = localStorage.getItem("authToken");
    if (type) {
      const newEntry = {
        clockIn: now,
        clockOut: null,
        jobSite: "Superior Mart",
        payGrade: 10,
      };
      const res = await saveClockEntry(newEntry, authToken);
      setEntries([...entries, res]);
      setLoading(false);
    } else {
      const oldEntry = entries.length > 0 ? entries.pop() : 0;
      const modEntry = {
        ...oldEntry,
        clockOut: now, // ✅ override after spreading
      };
      const res = await patchModEntry(modEntry, authToken);
      setEntries([...entries, res]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSetEntries = async () => {
      // Check if user is authenticated by looking at currentUser and authToken in localStorage
      const authToken = localStorage.getItem("authToken");
      if (!currentUser || !authToken) {
        console.error("User is not authenticated. Redirecting to login.");
        navigate("/"); // Redirect to login if the user is not authenticated
        return;
      }
      const data = await fetchEntries(authToken);
      setEntries(data); // Set the fetched entries in state
      setLoading(false);
      if (data.length > 0) {
        const lastEntry = data[data.length - 1];
        setType(lastEntry?.clockOut ? true : false); // If `clockOut` is null/empty, set `type` to `false` (ClockOut mode)
      }
    };

    fetchAndSetEntries();
  }, [currentUser, navigate]); // Run when `currentUser` or `navigate` changes

  return (
    <div className="bg-white w-full h-full flex flex-col py-8 px-8 font-Inter">
      <div className="flex flex-row justify-center items-center gap-8 mb-8">
        <button
          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm font-light tracking-wide transition-colors"
          onClick={() => {
            handleClockIn(type);
            setType(!type);
          }}
        >
          {type ? "Clock In" : "Clock Out"}
        </button>
        <Clock />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="border-t border-gray-200">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Clock In</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Clock Out</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Total Time</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody>
                {(Array.isArray(entries) ? entries : [])
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {entry.clockIn
                          ? new Date(entry.clockIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {entry.clockOut
                          ? new Date(entry.clockOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {`${entry.status} at ${entry.jobSite}` || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {typeof entry.hours === "number"
                          ? `${entry.hours.toFixed(2)} hrs`
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
export default Home;
