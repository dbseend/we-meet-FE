// src/api/meetingApi.js
import { supabase } from "../../lib/supabaseClient";

// 미팅 생성 API
export const createMeeting = async (meetingData) => {
  console.log("dates:", meetingData.dates);
  try {
    const formattedDates = meetingData.dates.map((date) => {
      // 날짜 객체 생성 시 시간을 정오(12:00)로 설정하여 시차 문제 방지
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return d.toISOString().split("T")[0];
    });
    console.log(formattedDates);

    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          title: meetingData.title,
          description: meetingData.description,
          dates: formattedDates,
          time_range_start: meetingData.time_range_start + ":00",
          time_range_end: meetingData.time_range_end + ":00",
          is_online: meetingData.is_online,
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: error.message };
  }
};

// 미팅 조회 API
export const getMeeting = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("meeting_id", meetingId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 미팅 참여 가능 시간 조회 API
export const getMeetingAvailiableTimes = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from("meeting_participants")
      .select("*")
      .eq("meeting_id", meetingId);

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching meeting availiable times:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 가능 시간 선택 제출 API
export const submitTimeSelections = async (submissionData) => {
  console.log(submissionData);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("meeting_participants")
      .insert({
        meeting_id: submissionData.meeting_id,
        participant_id: submissionData.participant_id,
        user_name: submissionData.user_name,
        selected_times: submissionData.selected_times,
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting time selections:", error);
    return { success: false, error };
  }
};

export const getUserMeetings = async (userId) => {
  try {
    // 미팅 참여자 테이블에서 사용자가 참여한 미팅 ID들을 조회
    const { data: participantData, error: participantError } = await supabase
      .from('meeting_participants')
      .select('meeting_id')
      .eq('participant_id', userId);

    if (participantError) throw participantError;

    // 참여한 미팅 ID 목록 추출
    const meetingIds = participantData.map(item => item.meeting_id);

    // 해당 미팅들의 상세 정보 조회
    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants (
          user_name,
          selected_times
        )
      `)
      .in('meeting_id', meetingIds);

    if (meetingsError) throw meetingsError;

    return {
      success: true,
      data: meetingsData
    };
  } catch (error) {
    console.error('Error fetching user meetings:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const checkLoginStatus = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return {
      isLoggedIn: !!user,
      userName: user?.user_metadata?.full_name || user?.email || "",
    };
  } catch (error) {
    console.error("Error checking login status:", error);
    return { isLoggedIn: false, userName: "" };
  }
};
