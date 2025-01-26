// GoogleCalendarContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { initializeGoogleCalendar } from "../../api/GoogleCalendarAPI";

const GoogleCalendarContext = createContext();

export const GoogleCalendarProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeCalendar = useCallback(async () => {
    if (isInitialized) {
      // 이미 초기화되어 있다면 토큰만 업데이트
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.provider_token) {
        window.gapi.client.setToken({
          access_token: session.provider_token,
        });
        return true;
      }
      return false;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        throw new Error("No provider token found");
      }

      await initializeGoogleCalendar(session.provider_token);
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Failed to initialize Google Calendar:", error);
      return false;
    }
  }, [isInitialized]); // supabase 의존성 제거

  const value = {
    isInitialized,
    initializeCalendar,
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
};

export const useGoogleCalendar = () => {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error(
      "useGoogleCalendar must be used within a GoogleCalendarProvider"
    );
  }
  return context;
};
