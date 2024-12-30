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

/**
 * 시간 선택을 위한 개별 셀 컴포넌트
 * @param {Object} props
 * @param {string} props.time - 표시할 시간 (예: "09:00")
 * @param {boolean} props.isSelected - 선택 여부
 * @param {boolean} props.isHovered - 호버/드래그 상태
 * @param {Function} props.onInteractionStart - 상호작용 시작 핸들러 (클릭/터치)
 * @param {Function} props.onInteractionMove - 상호작용 진행 핸들러 (드래그)
 * @param {Function} props.onInteractionEnd - 상호작용 종료 핸들러
 */
 const TimeCell = ({
  time,
  isSelected,
  isHovered,
  onInteractionStart,
  onInteractionMove,
  onInteractionEnd,
}) => {
  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    // 스크롤 방지를 위해 터치 이벤트의 기본 동작 중지
    e.preventDefault();
    const touch = e.touches[0];
    // 터치 위치의 Y 좌표와 스크롤 위치를 함께 전달
    onInteractionStart(time, touch.clientY + window.scrollY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    onInteractionMove(time, touch.clientY + window.scrollY);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    onInteractionEnd(time);
  };

  return (
    <div
      onMouseDown={(e) => onInteractionStart(time, e.clientY + window.scrollY)}
      onMouseEnter={(e) => onInteractionMove(time, e.clientY + window.scrollY)}
      onMouseUp={() => onInteractionEnd(time)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        border border-gray-200 h-8 cursor-pointer select-none
        ${isSelected ? "bg-blue-500 text-white" : "bg-white"}
        ${isHovered && !isSelected ? "bg-blue-100" : ""}
        ${isHovered && isSelected ? "bg-blue-400" : ""}
        transition-colors duration-150
        touch-none
      `}
    >
      <div className="h-full flex items-center justify-center text-sm">
        {time}
      </div>
    </div>
  );
};

// 시간표 컴포넌트
/**
 * 시간표 전체를 표시하고 관리하는 컴포넌트
 * @param {Object} props
 * @param {string} props.date - 표시할 날짜
 * @param {string} props.timeRangeStart - 시작 시간
 * @param {string} props.timeRangeEnd - 종료 시간
 * @param {Array<string>} props.selectedTimes - 선택된 시간 목록
 * @param {Function} props.onTimeSelect - 시간 선택 핸들러
 * @param {boolean} props.isSelectionEnabled - 선택 활성화 여부
 */
 const TimeTable = ({
  date,
  timeRangeStart,
  timeRangeEnd,
  selectedTimes,
  onTimeSelect,
  isSelectionEnabled,
}) => {
  // 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTimes, setHoveredTimes] = useState([]);
  
  // Refs for tracking interaction state
  const dragStartRef = useRef(null);            // 드래그 시작 시간
  const lastPositionRef = useRef(null);         // 마지막 상호작용 위치
  const interactionActiveRef = useRef(false);   // 상호작용 진행 중 여부
  const initialTouchRef = useRef(null);         // 초기 터치 위치
  const timeCellsRef = useRef({});             // 시간 셀 DOM 요소 참조

  /**
   * 시간 슬롯 배열 생성
   * @returns {Array<string>} 시간 슬롯 배열 (예: ["09:00", "09:30", ...])
   */
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

  /**
   * 특정 Y 좌표에 해당하는 가장 가까운 시간 찾기
   * @param {number} clientY - 마우스/터치의 Y 좌표 (스크롤 포함)
   * @returns {string|null} 가장 가까운 시간
   */
  const findTimeByPosition = (clientY) => {
    const entries = Object.entries(timeCellsRef.current);
    let closestTime = null;
    let minDistance = Infinity;

    entries.forEach(([time, element]) => {
      const rect = element.getBoundingClientRect();
      // 스크롤 위치를 고려한 실제 거리 계산
      const absoluteTop = rect.top + window.scrollY;
      const distance = Math.abs(clientY - (absoluteTop + rect.height / 2));
      
      if (distance < minDistance) {
        minDistance = distance;
        closestTime = time;
      }
    });

    return closestTime;
  };

  /**
   * 상호작용 시작 처리 (터치/마우스 다운)
   * @param {string} time - 선택된 시간
   * @param {number} clientY - Y 좌표
   */
  const handleInteractionStart = (time, clientY) => {
    if (!isSelectionEnabled) return;
    
    interactionActiveRef.current = true;
    setIsDragging(false);
    dragStartRef.current = time;
    lastPositionRef.current = clientY;
    initialTouchRef.current = clientY;
    setHoveredTimes([time]);
  };

  /**
   * 상호작용 진행 처리 (드래그/터치 무브)
   * @param {string} time - 현재 시간
   * @param {number} clientY - Y 좌표
   */
  const handleInteractionMove = (time, clientY) => {
    if (!isSelectionEnabled || !interactionActiveRef.current) return;
    
    // 드래그 판정을 위한 최소 이동 거리 체크 (5px)
    const moveDistance = Math.abs(clientY - initialTouchRef.current);
    if (moveDistance > 5) {
      setIsDragging(true);
    }
    
    const closestTime = findTimeByPosition(clientY);
    if (closestTime && lastPositionRef.current !== clientY) {
      setHoveredTimes([closestTime]);
      onTimeSelect(closestTime);
      lastPositionRef.current = clientY;
    }
  };

  /**
   * 상호작용 종료 처리 (터치/마우스 업)
   * @param {string} time - 선택된 시간
   */
  const handleInteractionEnd = (time) => {
    if (!isSelectionEnabled) return;

    // 드래그가 아닌 경우에만 토글 동작 수행
    if (!isDragging) {
      onTimeSelect(time);
    }

    // 상태 초기화
    interactionActiveRef.current = false;
    setIsDragging(false);
    dragStartRef.current = null;
    lastPositionRef.current = null;
    initialTouchRef.current = null;
    setHoveredTimes([]);
  };

  // 전역 이벤트 리스너 설정
  useEffect(() => {
    const handleGlobalEnd = () => {
      // 모든 상호작용 상태 초기화
      interactionActiveRef.current = false;
      setIsDragging(false);
      dragStartRef.current = null;
      lastPositionRef.current = null;
      initialTouchRef.current = null;
      setHoveredTimes([]);
    };

    // 전역 이벤트 리스너 등록
    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
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
              <div
                key={time}
                ref={(el) => {
                  if (el) timeCellsRef.current[time] = el;
                }}
              >
                <TimeCell
                  time={time}
                  isSelected={selectedTimes.includes(time)}
                  isHovered={hoveredTimes.includes(time)}
                  onInteractionStart={handleInteractionStart}
                  onInteractionMove={handleInteractionMove}
                  onInteractionEnd={handleInteractionEnd}
                />
              </div>
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