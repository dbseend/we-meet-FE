import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // supabase 클라이언트 임포트 필요

const TimeSlot = ({ time, isSelected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TIME_SLOT',
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TIME_SLOT',
    drop: () => onSelect(time),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`
        h-8 border border-gray-200 cursor-pointer
        ${isSelected ? 'bg-blue-500' : 'bg-white'}
        ${isOver ? 'bg-blue-100' : ''}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    />
  );
};

const TimeTable = ({ date, timeRange, selectedTimes, onTimeSelect }) => {
  const generateTimeSlots = () => {
    console.log(timeRange);
    const slots = [];
    const startHour = timeRange.start;
    const endHour = timeRange.end;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }

    console.log(slots.length);
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="font-bold mb-4">{date}</div>
      <div className="grid grid-cols-1 gap-0">
        {timeSlots.map((time) => (
          <TimeSlot
            key={time}
            time={time}
            isSelected={selectedTimes.includes(time)}
            onSelect={onTimeSelect}
          />
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
        const meetingId = window.location.pathname.split('/').pop();
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', meetingId)
          .single();

        if (error) throw error;
        
        setMeetingData({
          ...data,
          dates: JSON.parse(data.dates),
          time_range: JSON.parse(data.time_range)
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
    setSelectedTimes(prev => ({
      ...prev,
      [date]: prev[date] ? 
        prev[date].includes(time) ?
          prev[date].filter(t => t !== time) :
          [...prev[date], time] :
        [time]
    }));
  };

  const handlePrevDate = () => {
    setCurrentDateIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextDate = () => {
    setCurrentDateIndex(prev => 
      Math.min(prev + 1, (meetingData?.dates?.length || 1) - 1)
    );
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!meetingData) return <div className="text-center p-4">Meeting not found</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{meetingData.title}</h1>
        <p className="mb-6">{meetingData.description}</p>
        
        <div className="relative">
          <button
            onClick={handlePrevDate}
            disabled={currentDateIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2
              ${currentDateIndex === 0 ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <ChevronLeft size={24} />
          </button>
          
          <TimeTable
            date={meetingData.dates[currentDateIndex]}
            timeRange={meetingData.time_range}
            selectedTimes={selectedTimes[meetingData.dates[currentDateIndex]] || []}
            onTimeSelect={(time) => 
              handleTimeSelect(meetingData.dates[currentDateIndex], time)
            }
          />
          
          <button
            onClick={handleNextDate}
            disabled={currentDateIndex === meetingData.dates.length - 1}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2
              ${currentDateIndex === meetingData.dates.length - 1 ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Selected Times:</h2>
          {Object.entries(selectedTimes).map(([date, times]) => (
            <div key={date} className="mb-2">
              <span className="font-medium">{date}:</span>{' '}
              {times.sort().join(', ')}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MeetingScheduler;