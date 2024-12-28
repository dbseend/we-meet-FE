import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { getMeeting } from "../../api/meetingAPI";

const TimeSlot = ({ time, isSelected, onSelect, isHovered }) => {
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
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    const addMinutes = (hours, minutes, addedMinutes) => {
      let newMinutes = minutes + addedMinutes;
      let newHours = hours + Math.floor(newMinutes / 60);
      newMinutes = newMinutes % 60;
      return {
        hours: newHours,
        minutes: newMinutes
      };
    };

    const formatTime = (hours, minutes) => {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const start = parseTime(timeRangeStart);
    const end = parseTime(timeRangeEnd);
    
    let current = { ...start };
    
    while (
      (current.hours < end.hours) || 
      (current.hours === end.hours && current.minutes <= end.minutes)
    ) {
      slots.push(formatTime(current.hours, current.minutes));
      current = addMinutes(current.hours, current.minutes, 30);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const updateSelection = (startIdx, currentIdx, forceSelect = null) => {
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
    range.forEach(time => {
      const isTimeSelected = selectedTimes.includes(time);
      if (shouldSelect && !isTimeSelected) {
        onTimeSelect(time);
      } else if (!shouldSelect && isTimeSelected) {
        onTimeSelect(time);
      }
    });
  };

  const handleMouseDown = (time, index) => {
    setIsDragging(true);
    dragStartTimeRef.current = time;
    dragStartIndexRef.current = index;
    setLastHoveredIndex(index);

    // 초기 선택 상태를 토글
    const isSelected = selectedTimes.includes(time);
    updateSelection(index, index, !isSelected);
  };

  const handleMouseEnter = (time, index) => {
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
    if (!isDragging) {
      onTimeSelect(time);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
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
            onMouseDown={(e) => {
              e.preventDefault();
              handleMouseDown(time, index);
            }}
            onMouseEnter={() => handleMouseEnter(time, index)}
            onClick={() => handleClick(time)}
          >
            <TimeSlot
              time={time}
              isSelected={selectedTimes.includes(time)}
              isHovered={hoveredSlots.includes(time)}
              onSelect={onTimeSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const MeetingScheduler = () => {
  const [meetingData, setMeetingData] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const meetingId = window.location.pathname.split("/").pop();
        const { data, error } = await getMeeting(meetingId);

        if (error) throw error;

        setMeetingData({
          ...data,
          time_range_start: data.time_range_start,
          time_range_end: data.time_range_end,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
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
              const [aHour, aMin] = a.split(':').map(Number);
              const [bHour, bMin] = b.split(':').map(Number);
              if (aHour === bHour) {
                return aMin - bMin;
              }
              return aHour - bHour;
            })
      };
    });
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{meetingData.title}</h1>
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
          selectedTimes={selectedTimes[meetingData.dates[currentDateIndex]] || []}
          onTimeSelect={(time) =>
            handleTimeSelect(meetingData.dates[currentDateIndex], time)
          }
        />

        <button
          onClick={handleNextDate}
          disabled={currentDateIndex === meetingData.dates.length - 1}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2
            ${currentDateIndex === meetingData.dates.length - 1
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
            <span className="font-medium">{date}:</span>{" "}
            {times.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingScheduler;