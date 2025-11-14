import { createContext, useReducer } from "react";

export const TimeContext = createContext({
  sessions: [],
  activeSession: null,
  dispatchTime: () => {},
});

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSIONS":
      // Set all sessions (latest first)
      const sortedSessions = [...action.payload].sort((a, b) => {
        const timeA = new Date(a.startTime || 0);
        const timeB = new Date(b.startTime || 0);
        return timeB - timeA; // Latest first
      });
      // Find active session (one without endTime)
      const active = sortedSessions.find((s) => !s.endTime) || null;
      return {
        ...state,
        sessions: sortedSessions,
        activeSession: active,
      };

    case "ADD_SESSION":
      // Add new session and set as active
      const newSessions = [action.payload, ...state.sessions];
      return {
        ...state,
        sessions: newSessions,
        activeSession: action.payload,
      };

    case "UPDATE_SESSION":
      // Update a session (typically when clocking out)
      const updatedSessions = state.sessions.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      return {
        ...state,
        sessions: updatedSessions,
        activeSession: null, // No longer active after clock out
      };

    case "SET_ACTIVE_SESSION":
      return {
        ...state,
        activeSession: action.payload,
      };

    default:
      return state;
  }
};

export const TimeProvider = ({ children }) => {
  const [state, dispatchTime] = useReducer(reducer, {
    sessions: [],
    activeSession: null,
  });

  const value = { ...state, dispatchTime };
  return (
    <TimeContext.Provider value={value}>{children}</TimeContext.Provider>
  );
};
