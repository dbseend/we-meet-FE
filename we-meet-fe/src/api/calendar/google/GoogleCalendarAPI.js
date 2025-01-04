import axios from "axios";
import { supabase } from "../../../lib/supabaseClient";

// 특정 날짜들의 이벤트 조회
export const getEventsByDates = async (dates) => {
  try {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.provider_token;

    // 각 날짜별로 이벤트를 조회하고 결과를 합침
    const eventsByDate = await Promise.all(
      dates.map(async (date) => {
        // 날짜의 시작과 끝 시간 설정
        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);

        const response = await axios.get(
          process.env.REACT_APP_API_URL + "calendar/events", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              timeMin: startTime.toISOString(),
              timeMax: endTime.toISOString(),
              singleEvents: true,
              orderBy: "startTime",
            },
          }
        );

        return {
          date,
          events: response.data,
        };
      })
    );

    return eventsByDate;
  } catch (error) {
    console.error("Error fetching events by dates:", error);
    throw error;
  }
};