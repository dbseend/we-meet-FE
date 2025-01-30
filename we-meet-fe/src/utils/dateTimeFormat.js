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

export const generateTimeSlots = (dates, time_range_from, time_range_to, participants) => {
  if (!time_range_from || !time_range_to || !dates || dates.length === 0)
    return [];

  const [startHour] = time_range_from.split(":").map(Number);
  const [endHour] = time_range_to.split(":").map(Number);

  // 시간 문자열 미리 생성
  const timeStrings = Array.from({ length: (endHour - startHour + 1) * 2 }, (_, i) => {
    const hour = startHour + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // 결과 객체 생성
  return dates.reduce((result, date) => {
    // 현재 날짜에 대한 참가자 가능 시간 맵 생성
    const dayAvailability = {};
    participants.forEach(participant => {
      participant.available_times
        .filter(at => at.available_time.startsWith(date))
        .forEach(at => {
          const time = at.available_time.split('T')[1].substring(0, 5);
          if (!dayAvailability[time]) {
            dayAvailability[time] = [];
          }
          dayAvailability[time].push({
            user_name: participant.user_name,
            priority: at.priority
          });
        });
    });

    // 슬롯 생성
    result[date] = timeStrings.map(time => ({
      time,
      isSelected: false,
      priority: "available",
      date,
      participants: dayAvailability[time] || []
    }));

    return result;
  }, {});
};
