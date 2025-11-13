import React from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./routes/navigation/navigation";
import Home from "./routes/home/home";
import LandingPage from "./routes/authentication/landing-page";
import AuthPage from "./routes/authentication/auth-page";
import "/app.css";

const App = () => {
  return (
    <div className="font-Roboto">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<Navigation />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
