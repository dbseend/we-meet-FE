import React, { useState, useEffect } from "react";
import { createMeeting } from "../../api/meeting/MeetingAPI";

const CreateMeetingPage = () => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    dates: [],
    time_range_start: "09:00",
    time_range_end: "18:00",
    is_online: false,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isDateSelected = (date) => {
    return meetingData.dates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
  };

  const toggleDateSelection = (date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

    setMeetingData((prev) => {
      const dateExists = isDateSelected(date);
      return {
        ...prev,
        dates: dateExists
          ? prev.dates.filter((d) => d.toDateString() !== date.toDateString())
          : [...prev.dates, date],
      };
    });
  };

  const handleMouseDown = (date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setIsDragging(true);
    toggleDateSelection(date);
  };

  const handleMouseEnter = (date) => {
    if (isDragging) {
      toggleDateSelection(date);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingData.title || meetingData.dates.length === 0) {
      setShowAlert(true);
      return;
    }

    try {
      setIsLoading(true); // 로딩 상태 추가 필요
      const result = await createMeeting(meetingData);
      console.log("result: ", result);

      if (result.success) {
        // 성공 시 URL 복사 또는 다음 페이지로 이동
        navigator.clipboard.writeText(result.url);
        setCopied(true);
        // 필요한 경우 다음 페이지로 이동
        // navigate(`/meeting/${result.data.id}`);
      } else {
        setShowAlert(true);
        setErrorMessage(result.error); // 에러 메시지 상태 추가 필요
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      setShowAlert(true);
      setErrorMessage("회의 생성 중 오류가 발생했습니다."); // 에러 메시지 상태 추가 필요
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          새로운 미팅 만들기
        </h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            미팅명
          </label>
          <input
            type="text"
            name="title"
            value={meetingData.title}
            onChange={(e) =>
              setMeetingData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="미팅 제목을 입력하세요"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            name="description"
            value={meetingData.description}
            onChange={(e) =>
              setMeetingData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="미팅에 대한 설명을 입력하세요"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            날짜 선택
          </label>

          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
            • 날짜를 클릭하거나 드래그하여 여러 날짜를 선택할 수 있습니다
          </div>

          <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="text-lg font-semibold text-gray-800">
                  {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const date = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    index + 1
                  );
                  const isPast =
                    date < new Date(new Date().setHours(0, 0, 0, 0));
                  const isSelected = isDateSelected(date);

                  return (
                    <div
                      key={index}
                      onMouseDown={() => handleMouseDown(date)}
                      onMouseEnter={() => handleMouseEnter(date)}
                      className={`
                        p-2 text-center cursor-pointer select-none
                        ${
                          isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }
                        ${
                          isSelected
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : ""
                        }
                        rounded-lg transition-colors
                      `}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={meetingData.is_online}
                onChange={(e) =>
                  setMeetingData((prev) => ({
                    ...prev,
                    is_online: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>온라인 미팅</span>
            </label>
            {meetingData.is_online && (
              <div className="ml-6 text-sm text-gray-500">
                • 온라인 미팅 링크는 미팅 생성 후 참가자들에게 공유됩니다
              </div>
            )}
          </div>

          {meetingData.dates.length > 0 && (
            <div className="text-right text-sm text-gray-600">
              선택된 날짜: {meetingData.dates.length}일
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            시간대 설정
          </label>
          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
            <input
              type="time"
              name="timeRange.start"
              value={meetingData.time_range_start}
              onChange={(e) =>
                setMeetingData((prev) => ({
                  ...prev,
                  time_range_start: e.target.value,
                }))
              }
              min="06:00"
              max={meetingData.time_range_end}
              className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <span className="text-gray-500 font-medium">~</span>
            <input
              type="time"
              name="timeRange.end"
              value={meetingData.time_range_end}
              onChange={(e) =>
                setMeetingData((prev) => ({
                  ...prev,
                  time_range_end: e.target.value,
                }))
              }
              min={meetingData.time_range_start}
              max="21:00"
              className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          미팅 생성하기
        </button>
      </form>
    </div>
  );
};

export default CreateMeetingPage;
