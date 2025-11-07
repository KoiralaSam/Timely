import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

export const TimeContext = createContext({
  time: null,
  dispatchTime: () => {},
});

const reducer = (time, action) => {
  switch (action.type) {
    case "":
      break;
    case "":
      break;
    default:
      // Statements executed when none of the cases match the value of the expression
      break;
  }
};

export const TimeProvider = ({ children }) => {
  const [time, dispatchTime] = useReducer(reducer);
  const value = { time, dispatchTime };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
