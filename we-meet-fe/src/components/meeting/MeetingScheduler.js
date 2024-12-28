import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
  getMeeting,
  submitTimeSelections,
  checkLoginStatus,
} from "../../api/meeting/MeetingAPI";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/Dialog";
import { useToast } from "../ui/Toast";

const TimeSlot = ({ time, isSelected, isHovered }) => {
  return (
    <div
      className={`
        h-8 border border-gray-200 cursor-pointer flex items-center px-2 select-none
        ${isSelected ? "bg-blue-500 text-white" : "bg-white"}
        ${isHovered && !isSelected ? "bg-blue-100" : ""}
        ${isHovered && isSelected ? "bg-blue-400" : ""}
        transition-colors duration-150
      `}
    >
      {time}
    </div>
  );
};

const TimeTable = ({
  date,
  timeRangeStart,
  timeRangeEnd,
  selectedTimes,
  onTimeSelect,
  isSelectionEnabled,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastHoveredIndex, setLastHoveredIndex] = useState(null);
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const dragStartTimeRef = useRef(null);
  const dragStartIndexRef = useRef(null);
  const tableRef = useRef(null);

  const generateTimeSlots = () => {
    const slots = [];

    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return { hours, minutes };
    };

    const addMinutes = (hours, minutes, addedMinutes) => {
      let newMinutes = minutes + addedMinutes;
      let newHours = hours + Math.floor(newMinutes / 60);
      newMinutes = newMinutes % 60;
      return {
        hours: newHours,
        minutes: newMinutes,
      };
    };

    const formatTime = (hours, minutes) => {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };

    const start = parseTime(timeRangeStart);
    const end = parseTime(timeRangeEnd);

    let current = { ...start };

    while (
      current.hours < end.hours ||
      (current.hours === end.hours && current.minutes <= end.minutes)
    ) {
      slots.push(formatTime(current.hours, current.minutes));
      current = addMinutes(current.hours, current.minutes, 30);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const updateSelection = (startIdx, currentIdx, forceSelect = null) => {
    if (!isSelectionEnabled) return;

    let start, end;
    let shouldSelect;

    if (lastHoveredIndex !== null) {
      // 드래그 방향이 바뀌었는지 확인
      const lastDirection = lastHoveredIndex > dragStartIndexRef.current;
      const currentDirection = currentIdx > lastHoveredIndex;

      if (lastDirection !== currentDirection) {
        // 방향이 바뀌면 마지막 위치를 새로운 시작점으로 설정
        dragStartIndexRef.current = lastHoveredIndex;
      }
    }

    start = Math.min(dragStartIndexRef.current, currentIdx);
    end = Math.max(dragStartIndexRef.current, currentIdx);

    const range = timeSlots.slice(start, end + 1);
    setHoveredSlots(range);

    // 드래그 방향에 따라 선택/해제 결정
    if (forceSelect !== null) {
      shouldSelect = forceSelect;
    } else {
      shouldSelect = currentIdx > dragStartIndexRef.current;
    }

    // 선택 상태 업데이트
    range.forEach((time) => {
      const isTimeSelected = selectedTimes.includes(time);
      if (shouldSelect && !isTimeSelected) {
        onTimeSelect(time);
      } else if (!shouldSelect && isTimeSelected) {
        onTimeSelect(time);
      }
    });
  };

  const handleMouseDown = (time, index, e) => {
    if (!isSelectionEnabled) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartTimeRef.current = time;
    dragStartIndexRef.current = index;
    setLastHoveredIndex(index);

    const isSelected = selectedTimes.includes(time);
    updateSelection(index, index, !isSelected);
  };

  const handleMouseEnter = (time, index) => {
    if (!isSelectionEnabled) return;
    if (isDragging && dragStartIndexRef.current !== null) {
      updateSelection(dragStartIndexRef.current, index);
      setLastHoveredIndex(index);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartTimeRef.current = null;
    dragStartIndexRef.current = null;
    setLastHoveredIndex(null);
    setHoveredSlots([]);
  };

  const handleClick = (time) => {
    if (!isSelectionEnabled) return;
    if (!isDragging) {
      onTimeSelect(time);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={tableRef}
      className="w-full max-w-xl mx-auto p-4"
      onMouseLeave={() => {
        if (isDragging) {
          setHoveredSlots([]);
        }
      }}
    >
      <div className="font-bold mb-4">{date}</div>
      <div className="grid grid-cols-1 gap-1">
        {timeSlots.map((time, index) => (
          <div
            key={time}
            onMouseDown={(e) => handleMouseDown(time, index, e)}
            onMouseEnter={() => handleMouseEnter(time, index)}
            onClick={() => handleClick(time)}
            className={
              !isSelectionEnabled ? "pointer-events-none opacity-50" : ""
            }
          >
            <TimeSlot
              time={time}
              isSelected={selectedTimes.includes(time)}
              isHovered={hoveredSlots.includes(time)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

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
          : [...currentTimes, time].sort((a, b) => {
              const [aHour, aMin] = a.split(":").map(Number);
              const [bHour, bMin] = b.split(":").map(Number);
              if (aHour === bHour) {
                return aMin - bMin;
              }
              return aHour - bHour;
            }),
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

      // 선택 초기화
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
