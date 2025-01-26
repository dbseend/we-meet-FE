import React, { createContext, useContext } from 'react';
import { supabase } from './supabaseClient';

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const createMeeting = async (meetingData) => {
    try {
      // 1. Spring Boot API를 통해 미팅 ID 생성
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meetingData.title,
          description: meetingData.description,
          selectedDates: meetingData.selectedDates,
          timeRangeStart: meetingData.timeRange.start,
          timeRangeEnd: meetingData.timeRange.end,
        }),
      });

      const { meetingId } = await response.json();

      // 2. Supabase에 미팅 데이터 저장
      const { data, error } = await supabase
        .from('meetings')
        .insert([
          {
            id: meetingId,
            title: meetingData.title,
            description: meetingData.description,
            selected_dates: meetingData.selectedDates.map(date => date.toISOString()),
            time_range_start: meetingData.timeRange.start,
            time_range_end: meetingData.timeRange.end,
            created_at: new Date().toISOString(),
          },
        ])
        .single();

      if (error) throw error;
      
      return meetingId;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  return (
    <MeetingContext.Provider value={{ createMeeting }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};