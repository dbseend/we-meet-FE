// UUID 생성
export const generateUUID = () => {
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  return uuid;
};

// URL 복사
export const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      alert('URL이 복사되었습니다!');
    })
    .catch((err) => {
      console.error('URL 복사 실패:', err);
      alert('URL 복사에 실패했습니다.');
    });
};
