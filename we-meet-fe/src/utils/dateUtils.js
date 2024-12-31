/**
 * 시간을 DB 저장 형식(UTC)으로 변환
 * @param {string} displayTime - "HH:mm" 형식의 시간 (예: "14:30")
 * @returns {string} "HH:mm" 형식의 UTC 시간
 */
export const convertDisplayTimeToDB = (displayTime) => {
  const [hours, minutes] = displayTime.split(":").map(Number);
  const dbHours = (hours - 9).toString().padStart(2, "0"); // KST -> UTC (9시간 차이)
  return `${dbHours}:${minutes.toString().padStart(2, "0")}`;
};

/**
 * DB 시간(UTC)을 화면 표시용 시간으로 변환
 * @param {string} dbTime - "HH:mm" 형식의 UTC 시간
 * @returns {string} "HH:mm" 형식의 표시 시간
 */
// TODO: 미팅 생성 시 설정한 시작 시간으로 계산
export const convertDBTimeToDisplay = (dbTime) => {
  const [hours, minutes] = dbTime.split(":").map(Number);
  const displayHours = (hours + 9) % 24; // UTC -> KST
  return `${displayHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

/**
 * ISO 문자열을 날짜와 시간으로 분리
 * @param {string} isoString - ISO 형식의 날짜/시간 문자열
 * @returns {object} { date: "YYYY-MM-DD", time: "HH:mm" }
 */
export const parseISOString = (isoString) => {
  const [datePart, timePart] = isoString.split("T");
  const time = timePart.split("+")[0].substring(0, 5); // HH:mm 형식으로 추출
  return { date: datePart, time };
};

/**
 * 시작 시간과 종료 시간 사이의 30분 간격 시간 슬롯 생성
 * @param {string} startTime - "HH:mm" 형식의 시작 시간
 * @param {string} endTime - "HH:mm" 형식의 종료 시간
 * @returns {string[]} 30분 간격의 시간 배열
 */
export const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  const [startHour] = startTime.split(":").map(Number);
  const [endHour] = endTime.split(":").map(Number);

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour !== endHour) {
      // 종료 시간이 정시면 30분 슬롯은 제외
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};
