import { createContext, useContext } from "react";
import { useResponsiveState } from "../hooks/useResponsiveState";
import { useAuthState } from "../hooks/useAuthState";
import { useGoogleCalendarState } from "../hooks/useGoogleCalendarState";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { isMobile } = useResponsiveState();
  const { session, user } = useAuthState();
  const calendar = useGoogleCalendarState();

  const value = {
    isMobile,
    session,
    user,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
