import { createContext, useReducer } from "react";

export const ExpenseContext = createContext({
  expenses: [],
  dispatchExpense: () => {},
});

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EXPENSES":
      // Set all expenses
      const sortedExpenses = [...action.payload].sort((a, b) => {
        const timeA = new Date(a.date || 0);
        const timeB = new Date(b.date || 0);
        return timeB - timeA; // Latest first
      });

      return {
        ...state,
        expenses: sortedExpenses,
      };

    case "ADD_EXPENSE":
      // Add new expense
      const newExpenses = [action.payload, ...state.expenses];
      return {
        ...state,
        expenses: newExpenses,
      };

    case "UPDATE_EXPENSE":
      // Update an expense
      const updatedExpenses = state.expenses.map((e) =>
        e.id === action.payload.id ? action.payload : e
      );
      return {
        ...state,
        expenses: updatedExpenses,
      };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatchExpense] = useReducer(reducer, {
    expenses: [],
  });

  const value = { ...state, dispatchExpense };
  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
