import { ChevronLeft, ChevronRight, Share2, Link } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
  getMeeting,
  submitTimeSelections,
  checkLoginStatus,
} from "../../api/meeting/MeetingAPI";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/Dialog";
import { useToast } from "../ui/Toast";

// 시간 셀 컴포넌트
const TimeCell = ({
  time,
  isSelected,
  isHovered,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp} // mouseUp 이벤트 추가
      className={`
        border border-gray-200 h-8 cursor-pointer select-none
        ${isSelected ? "bg-blue-500 text-white" : "bg-white"}
        ${isHovered && !isSelected ? "bg-blue-100" : ""}
        ${isHovered && isSelected ? "bg-blue-400" : ""}
        transition-colors duration-150
      `}
    >
      <div className="h-full flex items-center justify-center text-sm">
        {time}
      </div>
    </div>
  );
};

// 시간표 컴포넌트
const TimeTable = ({
  date,
  timeRangeStart,
  timeRangeEnd,
  selectedTimes,
  onTimeSelect,
  isSelectionEnabled,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTimes, setHoveredTimes] = useState([]);
  const dragStartRef = useRef(null);
  const mouseDownRef = useRef(false);

  // 시간 슬롯 생성
  const generateTimeSlots = () => {
    const slots = [];
    const [startHour] = timeRangeStart.split(":").map(Number);
    const [endHour] = timeRangeEnd.split(":").map(Number);

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleMouseDown = (time) => {
    if (!isSelectionEnabled) return;
    mouseDownRef.current = true; // 마우스 다운 상태 기록
    setIsDragging(false); // 초기에는 드래그 상태가 아님
    dragStartRef.current = time;
  };

  const handleMouseEnter = (time) => {
    if (!isSelectionEnabled || !mouseDownRef.current) return;
    setIsDragging(true); // 마우스 이동이 있으면 드래그 상태로 변경
    setHoveredTimes([time]);
    onTimeSelect(time);
  };

  const handleMouseUp = (time) => {
    if (!isSelectionEnabled) return;

    // 드래그가 아닌 경우에만 클릭 동작 수행
    if (!isDragging) {
      onTimeSelect(time);
    }

    // 상태 초기화
    setIsDragging(false);
    dragStartRef.current = null;
    setHoveredTimes([]);
    mouseDownRef.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      setHoveredTimes([]);
      mouseDownRef.current = false;
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="font-bold mb-4">{date}</div>
      <div className="flex">
        {/* 시간 레이블 */}
        <div className="w-16 flex flex-col">
          {timeSlots.map(
            (time, index) =>
              index % 2 === 0 && (
                <div
                  key={`label-${time}`}
                  className="h-16 flex items-center justify-end pr-2 text-sm text-gray-500"
                >
                  {time}
                </div>
              )
          )}
        </div>
        {/* 시간 선택 그리드 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-0">
            {timeSlots.map((time) => (
              <TimeCell
                key={time}
                time={time}
                isSelected={selectedTimes.includes(time)}
                isHovered={hoveredTimes.includes(time)}
                onMouseDown={() => handleMouseDown(time)}
                onMouseEnter={() => handleMouseEnter(time)}
                onMouseUp={() => handleMouseUp(time)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 제출 다이얼로그 컴포넌트
const SubmitDialog = ({ isOpen, onClose, onSubmit, isLoggedIn, userName }) => {
  const [name, setName] = useState(userName || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(name);
      onClose();
    } catch (error) {
      setError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>시간 선택 제출</DialogTitle>
        </DialogHeader>
        {!isLoggedIn && (
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              disabled={submitting}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )}
        {isLoggedIn && (
          <p className="py-4">{userName} 님의 이름으로 제출됩니다.</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "제출 중..." : "제출"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 메인 미팅 스케줄러 컴포넌트
const MeetingScheduler = () => {
  const [meetingData, setMeetingData] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { toast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingId = window.location.pathname.split("/").pop();
        const { data, error: meetingError } = await getMeeting(meetingId);
        const { isLoggedIn, userName } = await checkLoginStatus();

        if (meetingError) throw meetingError;

        setMeetingData(data);
        setIsLoggedIn(isLoggedIn);
        setUserName(userName);
      } catch (err) {
        setError(err.message);
        toast({
          title: "에러",
          description: "미팅 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTimeSelect = (date, time) => {
    setSelectedTimes((prev) => {
      const currentTimes = prev[date] || [];
      const timeExists = currentTimes.includes(time);

      return {
        ...prev,
        [date]: timeExists
          ? currentTimes.filter((t) => t !== time)
          : [...currentTimes, time].sort(),
      };
    });
  };

  const handleSubmit = async (name) => {
    try {
      const submissionData = {
        meetingId: meetingData.id,
        userName: name,
        selectedTimes,
      };

      const { error } = await submitTimeSelections(submissionData);
      if (error) throw error;

      toast({
        title: "성공",
        description: "시간 선택이 성공적으로 제출되었습니다.",
      });

      setSelectedTimes({});
    } catch (error) {
      toast({
        title: "에러",
        description: "시간 선택 제출에 실패했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePrevDate = () => {
    setCurrentDateIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextDate = () => {
    setCurrentDateIndex((prev) =>
      Math.min(prev + 1, (meetingData?.dates?.length || 1) - 1)
    );
  };

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "링크 복사 완료",
          description: "미팅 URL이 클립보드에 복사되었습니다.",
        });
      })
      .catch(() => {
        toast({
          title: "복사 실패",
          description: "URL을 복사하는데 실패했습니다.",
          variant: "destructive",
        });
      });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meetingData.title,
          text: meetingData.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyUrl();
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!meetingData)
    return <div className="text-center p-4">Meeting not found</div>;

  const hasSelectedTimes = Object.values(selectedTimes).some(
    (times) => times.length > 0
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{meetingData.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            공유하기
          </Button>
          <Button variant="outline" onClick={handleCopyUrl}>
            <Link className="w-4 h-4 mr-2" />
            URL 복사
          </Button>
          <Button
            variant={isSelectionEnabled ? "default" : "outline"}
            onClick={() => setIsSelectionEnabled(!isSelectionEnabled)}
          >
            {isSelectionEnabled ? "선택 비활성화" : "선택 활성화"}
          </Button>
          <Button
            onClick={() => setIsSubmitDialogOpen(true)}
            disabled={!hasSelectedTimes}
          >
            시간 선택 제출
          </Button>
        </div>
      </div>

      <p className="mb-6">{meetingData.description}</p>

      <div className="relative">
        <button
          onClick={handlePrevDate}
          disabled={currentDateIndex === 0}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2
            ${currentDateIndex === 0 ? "text-gray-300" : "text-gray-700"}
          `}
        >
          <ChevronLeft size={24} />
        </button>

        <TimeTable
          date={meetingData.dates[currentDateIndex]}
          timeRangeStart={meetingData.time_range_start}
          timeRangeEnd={meetingData.time_range_end}
          selectedTimes={
            selectedTimes[meetingData.dates[currentDateIndex]] || []
          }
          onTimeSelect={(time) =>
            handleTimeSelect(meetingData.dates[currentDateIndex], time)
          }
          isSelectionEnabled={isSelectionEnabled}
        />

        <button
          onClick={handleNextDate}
          disabled={currentDateIndex === meetingData.dates.length - 1}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2
            ${
              currentDateIndex === meetingData.dates.length - 1
                ? "text-gray-300"
                : "text-gray-700"
            }
          `}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Selected Times:</h2>
        {Object.entries(selectedTimes).map(([date, times]) => (
          <div key={date} className="mb-2">
            <span className="font-medium">{date}:</span> {times.join(", ")}
          </div>
        ))}
      </div>

      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <ToastContainer />
    </div>
  );
};

export default MeetingScheduler;
