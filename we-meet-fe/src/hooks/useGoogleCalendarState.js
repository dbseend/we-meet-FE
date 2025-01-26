import { useState, useCallback } from "react";
import { supabase } from "../api/supabase/supabaseClient";
import { initializeGoogleCalendar } from "../api/GoogleCalendarAPI";

export const useGoogleCalendarState = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeCalendar = useCallback(async () => {
    if (isInitialized) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.provider_token) {
        window.gapi.client.setToken({ access_token: session.provider_token });
        return true;
      }
      return false;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.provider_token) throw new Error("No provider token found");

      await initializeGoogleCalendar(session.provider_token);
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Failed to initialize Google Calendar:", error);
      return false;
    }
  }, [isInitialized]);

  return { isInitialized, initializeCalendar };
};
