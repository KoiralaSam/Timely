import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./contexts/userContext.jsx";
import { TimeProvider } from "./contexts/timeContext.jsx";
import { ExpenseProvider } from "./contexts/expenseContext.jsx";
import { AccountProvider } from "./contexts/accountContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <TimeProvider>
        <ExpenseProvider>
          <AccountProvider>
            <App />
          </AccountProvider>
        </ExpenseProvider>
      </TimeProvider>
    </UserProvider>
  </BrowserRouter>
);
