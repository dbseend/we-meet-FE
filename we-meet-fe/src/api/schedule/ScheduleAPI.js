import { supabase } from "../supabase/supabaseClient";

// 미팅 생성 API
export const createMeeting = async (meetingData) => {
  console.log("meeting data", meetingData);

  try {
    const { data, error } = await supabase
      .from("meetings")
      .insert([meetingData])
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


