// src/api/meetingApi.js
import { supabase } from "../../lib/supabaseClient";

// 미팅 생성 API
export const createMeeting = async (meetingData) => {
  try {
    const formattedDates = meetingData.dates.map(
      (date) => new Date(date).toISOString().split("T")[0]
    );

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
        user_id: submissionData.user_id,
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
