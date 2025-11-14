import { createContext, useEffect, useReducer } from "react";

export const UserContext = createContext({
  currentUser: null,
  dispatchUser: () => {},
  isInitialized: false,
});

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      // Set user after login or signup
      // Store user data WITHOUT token in state
      const userData = {
        id: action.payload.user.id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        hourly_rate: action.payload.user.hourly_rate,
      };

      console.log("Storing user data:", userData);
      // Store token separately and user data in localStorage
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(userData));
      return { ...state, currentUser: userData, isInitialized: true };

    case "LOGOUT_USER":
      // Clear user data from state and localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { ...state, currentUser: null, isInitialized: true };

    case "RESTORE_USER":
      // Restore user from localStorage (on app load)
      // User data is stored without token
      return { ...state, currentUser: action.payload, isInitialized: true };

    case "INITIALIZE":
      return { ...state, isInitialized: true };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  // Initial state with isInitialized flag
  const [state, dispatchUser] = useReducer(reducer, {
    currentUser: null,
    isInitialized: false,
  });

  // On component mount, try to restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    // If both token and user exist, restore the user
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatchUser({
          type: "RESTORE_USER",
          payload: parsedUser,
        });
      } catch (error) {
        console.error("Error restoring user from localStorage:", error);
        // Clean up invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        dispatchUser({ type: "INITIALIZE" });
      }
    } else {
      // No user data found, mark as initialized
      dispatchUser({ type: "INITIALIZE" });
    }
  }, []);

  const value = {
    currentUser: state.currentUser,
    dispatchUser,
    isInitialized: state.isInitialized,
  };
  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};
