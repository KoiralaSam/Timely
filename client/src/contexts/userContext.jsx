import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

export const UserContext = createContext({
  currentUser: null,
  dispachUser: () => {},
});

const reducer = (currentUser, action) => {
  switch (action.type) {
    case "saveUser":
      localStorage.setItem("user", action.payload);
      return action.payload;
      break;

    case "logoutUser":
      axios({
        url: "http://localhost:3000/user/logout",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Assuming a Bearer token
        },
      })
        .then((res) => {
          if (res.status === 200) {
            localStorage.removeItem("user");
            return null;
          }
        })
        .catch((error) => {
          console.log(currentUser.token);
          console.log(error);
        });
      break;
    default:
      // Statements executed when none of the cases match the value of the expression
      break;
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, dispatchUser] = useReducer(reducer);
  const value = { currentUser, dispatchUser };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the JSON string
        dispatchUser({ type: "saveUser", payload: parsedUser });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
  }, []);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
