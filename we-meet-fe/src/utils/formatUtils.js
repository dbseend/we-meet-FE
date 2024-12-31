/**
 * 날짜/시간 포맷팅
 * @param {string} datetime - ISO 형식의 날짜/시간 문자열
 * @returns {string} "YYYY-MM-DD HH:mm" 형식의 문자열
 */
export const formatDateTime = (datetime) => {
  const [date, time] = datetime.split("T");
  return `${date} ${time.split("+")[0].slice(0, 5)}`;
};

/**
 * 숫자를 지정된 자릿수의 문자열로 변환
 * @param {number} num - 변환할 숫자
 * @param {number} digits - 자릿수 (기본값: 2)
 * @returns {string} 패딩된 문자열
 */
export const padNumber = (num, digits = 2) => {
  return String(num).padStart(digits, "0");
};

/**
 * 이메일 주소 포맷 검증
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} 유효한 이메일이면 true
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL에서 쿼리 파라미터 추출
 * @param {string} url - URL 문자열
 * @returns {Object} 쿼리 파라미터 객체
 */
export const getQueryParams = (url) => {
  const params = {};
  const searchParams = new URLSearchParams(url.split("?")[1]);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};
