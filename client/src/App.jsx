import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./routes/navigation/navigation";
import Home from "./routes/home/home";
import Layout from "./routes/layout/layout.route";
import { UserContext } from "./contexts/userContext";
import { useNavigate } from "react-router-dom";
import "/app.css";

const App = () => {
  const { dispatchUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the JSON string
        dispatchUser({ type: "saveUser", payload: parsedUser }); // Dispatch to context
        navigate("/home"); // Navigate to "/home" if a user is present
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
  }, [dispatchUser]); // Run only once when the app loads

  return (
    <div className="font-Roboto">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/home" element={<Navigation />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
