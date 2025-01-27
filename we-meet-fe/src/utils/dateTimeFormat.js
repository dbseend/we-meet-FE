export const formatTime = (time) => {
  return time + ":00";
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
