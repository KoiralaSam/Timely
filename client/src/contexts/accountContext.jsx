import { createContext, useReducer } from "react";

export const AccountContext = createContext({
  accounts: [],
  dispatchAccount: () => {},
});

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCOUNTS":
      // Set all accounts
      return {
        ...state,
        accounts: action.payload || [],
      };

    case "ADD_ACCOUNT":
      // Add new account
      const newAccounts = [action.payload, ...state.accounts];
      return {
        ...state,
        accounts: newAccounts,
      };

    case "UPDATE_ACCOUNT":
      // Update an account
      const updatedAccounts = state.accounts.map((a) =>
        a.id === action.payload.id ? action.payload : a
      );
      return {
        ...state,
        accounts: updatedAccounts,
      };

    case "DELETE_ACCOUNT":
      // Delete an account
      const filteredAccounts = state.accounts.filter(
        (a) => a.id !== action.payload.id
      );
      return {
        ...state,
        accounts: filteredAccounts,
      };

    default:
      return state;
  }
};

export const AccountProvider = ({ children }) => {
  const [state, dispatchAccount] = useReducer(reducer, {
    accounts: [],
  });

  const value = { ...state, dispatchAccount };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};
