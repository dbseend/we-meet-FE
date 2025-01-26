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
