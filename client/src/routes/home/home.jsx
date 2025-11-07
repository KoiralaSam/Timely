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
    if (type) {
      const newEntry = {
        clockIn: now,
        clockOut: null,
        jobSite: "Superior Mart",
        payGrade: 10,
      };
      const res = await saveClockEntry(newEntry, currentUser.token);
      setEntries([...entries, res]);
      setLoading(false);
    } else {
      const oldEntry = entries.length > 0 ? entries.pop() : 0;
      const modEntry = {
        ...oldEntry,
        clockOut: now, // ✅ override after spreading
      };
      const res = await patchModEntry(modEntry, currentUser.token);
      setEntries([...entries, res]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSetEntries = async () => {
      if (!currentUser || !currentUser.token) {
        console.error("User is not authenticated. Redirecting to login.");
        navigate("/"); // Redirect to login if the user is not authenticated
        return;
      }
      const data = await fetchEntries(currentUser.token);
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
    <div className="bg-gray-50 w-full h-screen flex flex-col py-4 font-Inter">
      <div className="flex flex-row justify-evenly">
        <button
          className="px-4 w-[120px] bg-slate-600 hover:bg-slate-700 text-white rounded-xl shadow-md transition duration-200"
          onClick={() => {
            handleClockIn(type);
            setType(!type);
          }}
        >
          {type ? "ClockIn" : "ClockOut"}
        </button>
        <Clock />
      </div>

      <div className="m-5">
        <div className="max-h-[800px] overflow-y-auto rounded-[12px] shadow-md">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left">Clock In</th>
                <th className="py-3 px-4 text-left">Clock Out</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Total Time</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody className="hover:bg-[#f0f4ff]">
                {(Array.isArray(entries) ? entries : [])
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b even:bg-gray-100 hover:bg-indigo-50"
                    >
                      <td className="py-2 px-4">
                        {entry.clockIn
                          ? new Date(entry.clockIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-2 px-4">
                        {entry.clockOut
                          ? new Date(entry.clockOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-2 px-4">
                        {`${entry.status} at ${entry.jobSite}` || "-"}
                      </td>
                      <td className="py-2 px-4">
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
