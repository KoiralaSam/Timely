import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./contexts/userContext.jsx";
import { TimeProvider } from "./contexts/timeContext.jsx";
import { ExpenseProvider } from "./contexts/expenseContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <TimeProvider>
        <ExpenseProvider>
          <App />
        </ExpenseProvider>
      </TimeProvider>
    </UserProvider>
  </BrowserRouter>
);
