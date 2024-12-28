// 이벤트 조회
export const fetchEvents = async () => {
  try {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.provider_token;

    const response = await axios.get(
      process.env.REACT_APP_API_URL + "calendar/events",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// 이벤트 생성
export const createEvent = async (eventData) => {
  try {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.provider_token;

    const response = await axios.post(
        process.env.REACT_APP_API_URL + "calendar/events",
        eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
