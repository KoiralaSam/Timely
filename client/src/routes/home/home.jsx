import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import Clock from "../../components/home.components/clock.component";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const normalizeSession = (apiSession) => {
  if (!apiSession) return null;
  return {
    id: apiSession.id,
    startTime: apiSession.start_time,
    endTime: apiSession.end_time,
    overtimeMultiplier: apiSession.overtime_multiplier,
  };
};

const formatTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (start, end) => {
  if (!start || !end) return "-";
  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return "-";
  const hours = diffMs / (1000 * 60 * 60);
  return `${hours.toFixed(2)} hrs`;
};

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser, isInitialized } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for context to finish initializing before checking auth
    if (!isInitialized) {
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!currentUser || !authToken) {
      navigate("/");
      return;
    }
    setLoading(false);
  }, [currentUser, isInitialized, navigate]);

  const saveClockEntry = async (token) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/clock/in`, null, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return normalizeSession(res.data?.clockSession);
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  const closeClockEntry = async (sessionId, token) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/clock/out/${sessionId}`, null, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return normalizeSession(res.data?.clockSession);
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  const handleClockToggle = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("User is not authenticated. Redirecting to login.");
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null); // Clear previous errors

    try {
      if (!activeSession) {
        const newSession = await saveClockEntry(authToken);
        if (newSession) {
          setActiveSession(newSession);
          setSessions((prev) => [...prev, newSession]);
        }
      } else {
        const updatedSession = await closeClockEntry(activeSession.id, authToken);
        if (updatedSession) {
          setActiveSession(null);
          setSessions((prev) =>
            prev.map((session) =>
              session.id === updatedSession.id ? updatedSession : session
            )
          );
        }
      }
    } catch (error) {
      // Extract error message from backend response
      const message = error.response?.data?.message || error.message || "An error occurred";
      setErrorMessage(message);
      console.error("Clock operation error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

  const buttonLabel = useMemo(
    () => (activeSession ? "Clock Out" : "Clock In"),
    [activeSession]
  );

  return (
    <div className="bg-white w-full h-full flex flex-col py-8 px-8 font-Inter">
      <div className="flex flex-row justify-center items-center gap-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <button
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm font-light tracking-wide transition-colors disabled:opacity-60"
            onClick={handleClockToggle}
            disabled={isSubmitting || loading}
          >
            {buttonLabel}
          </button>
          {errorMessage && (
            <p className="text-sm text-red-600 text-center max-w-xs">
              {errorMessage}
            </p>
          )}
        </div>
        <Clock />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="border-t border-gray-200">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Clock In</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Clock Out</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Duration</th>
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
                {(Array.isArray(sessions) ? sessions : [])
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatTime(entry.startTime)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatTime(entry.endTime)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDuration(entry.startTime, entry.endTime)}
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
