export const formatTime = (time) => {
  return time + ":00";
};

export const parseISOString = (isoString) => {
  const [datePart, timePart] = isoString.split("T");
  const time = timePart.split("+")[0].substring(0, 5); // HH:mm 형식으로 추출
  return { date: datePart, time };
};

export const convertToISO = (date, time) => {
  return new Date(`${date}T${time}:00`).toISOString();
};

export const convertToUTC = (date, time) => {
  const localDate = new Date(`${date}T${time}`);

  // 9시간 추가 (밀리초 단위로 변환: 9시간 * 60분 * 60초 * 1000밀리초)
  // TODO: 하드코딩으로 해결하는 문제가 맞을까,,,
  const adjustedDate = new Date(localDate.getTime() + 9 * 60 * 60 * 1000);

  return adjustedDate.toISOString();
};

// 시간 슬롯 정렬 함수
export const sortTimeSlots = (slots) => {
  return slots.sort((a, b) => {
    return a.available_time.localeCompare(b.available_time);
  });
};

export const generateTimeSlots = (dates, time_range_from, time_range_to) => {
  if (!time_range_from || !time_range_to || !dates || dates.length === 0) return [];
  
  const result = {};
  const [startHour] = time_range_from.split(":").map(Number);
  const [endHour] = time_range_to.split(":").map(Number);

  // 각 날짜별로 시간대 생성
  dates.forEach(date => {
    const slots = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        isSelected: false,
        priority: "available",
        date: date // 날짜 정보 추가
      });
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        isSelected: false,
        priority: "available",
        date: date // 날짜 정보 추가
      });
    }
    
    result[date] = slots;
  });

  return result;
};