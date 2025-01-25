// calendarService.js

// Google API 설정
const CONFIG = {
  API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
  DISCOVERY_DOCS: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

/**
 * Google Calendar API 초기화
 * @param {string} accessToken 구글 액세스 토큰
 * @returns {Promise} 초기화 성공 여부
 */
export const initializeGoogleCalendar = async (accessToken) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: CONFIG.API_KEY,
            discoveryDocs: CONFIG.DISCOVERY_DOCS,
          });

          window.gapi.client.setToken({
            access_token: accessToken,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };

    script.onerror = reject;
    document.body.appendChild(script);
  });
};

/**
 * Google Calendar 이벤트 받아오기
 * @param {string[]} dates 선택한 날짜들의 배열 (YYYY-MM-DD 형식)
 * @returns {Promise<Object>} 날짜별 이벤트 맵
 */
 export const getAllCalendarEvents = async (dates) => {
  if (!window.gapi?.client) {
    throw new Error('Google Calendar API is not initialized');
  }

  try {
    const calendarList = await window.gapi.client.calendar.calendarList.list();
    const calendars = calendarList.result.items;

    const eventsByDate = {};

    for (const date of dates) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const eventsPromises = calendars
        .filter((calendar) => calendar.selected !== false)
        .map(async (calendar) => {
          try {
            const response = await window.gapi.client.calendar.events.list({
              calendarId: calendar.id,
              timeMin: startDate.toISOString(),
              timeMax: endDate.toISOString(),
              showDeleted: false,
              singleEvents: true,
              orderBy: "startTime",
            });

            return response.result.items.map((event) => ({
              ...event,
              calendarInfo: {
                id: calendar.id,
                name: calendar.summary,
                color: calendar.backgroundColor,
                primary: calendar.primary || false,
              },
            }));
          } catch (error) {
            console.warn(
              `Failed to fetch events for calendar ${calendar.summary}:`,
              error
            );
            return [];
          }
        });

      const allEvents = await Promise.all(eventsPromises);
      eventsByDate[date] = allEvents
        .flat()
        .sort((a, b) => {
          const timeA = new Date(a.start.dateTime || a.start.date);
          const timeB = new Date(b.start.dateTime || b.start.date);
          return timeA - timeB;
        });
    }

    return eventsByDate;
  } catch (error) {
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
};

/**
 * 이벤트 생성 (기본 캘린더에)
 * @param {Object} eventData 이벤트 데이터
 * @returns {Promise<Object>} 생성된 이벤트 정보
 */
export const createEvent = async (eventData) => {
  try {
    // 기본 캘린더 ID 조회
    const calendarList = await window.gapi.client.calendar.calendarList.list();
    const primaryCalendar = calendarList.result.items.find(
      (cal) => cal.primary
    );

    if (!primaryCalendar) {
      throw new Error("Primary calendar not found");
    }

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: primaryCalendar.id,
      resource: eventData,
    });

    return response.result;
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

/**
 * 이벤트 수정
 * @param {string} eventId 이벤트 ID
 * @param {Object} eventData 수정할 이벤트 데이터
 * @param {string} calendarId 캘린더 ID
 * @returns {Promise<Object>} 수정된 이벤트 정보
 */
export const updateEvent = async (eventId, eventData, calendarId) => {
  try {
    const response = await window.gapi.client.calendar.events.update({
      calendarId: calendarId,
      eventId: eventId,
      resource: eventData,
    });
    return response.result;
  } catch (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

/**
 * 이벤트 삭제
 * @param {string} eventId 이벤트 ID
 * @param {string} calendarId 캘린더 ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId, calendarId) => {
  try {
    await window.gapi.client.calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

// 토큰 갱신
export const updateAccessToken = (newAccessToken) => {
  if (window.gapi && window.gapi.client) {
    window.gapi.client.setToken({
      access_token: newAccessToken,
    });
  }
};
