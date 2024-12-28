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

// 미팅 목록 조회 API
export const getMeetings = async () => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 미팅 업데이트 API
export const updateMeeting = async (meetingId, updateData) => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .update({
        title: updateData.title,
        description: updateData.description,
        dates: updateData.dates,
        time_range: updateData.timeRange,
        updated_at: new Date().toISOString(),
      })
      .eq("id", meetingId)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0],
    };
  } catch (error) {
    console.error("Error updating meeting:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 미팅 삭제 API
export const deleteMeeting = async (meetingId) => {
  try {
    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", meetingId);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const submitTimeSelections = async (submissionData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("time_selections").insert({
      meeting_id: submissionData.meetingId,
      user_id: user?.id || null,
      user_name: submissionData.userName,
      selected_times: submissionData.selectedTimes,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error submitting time selections:", error);
    return { error };
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