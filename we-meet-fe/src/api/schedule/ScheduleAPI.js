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

// 미팅 응답 api
export const addMeetingAvailability = async (
  participantData,
  availableTimes
) => {
  console.log(participantData);
  try {
    // 1. 참가자 추가
    const { data: participant, error: participantError } = await supabase
      .from("meeting_participants")
      .insert([participantData])
      .select("participant_id")
      .single();

    if (participantError) throw participantError;

    // 2. 가능 시간 추가
    const availableTimeRecords = availableTimes.map((time) => ({
      participant_id: participantData.participant_id,
      available_time: time.available_time,
      priority: time.priority,
    }));

    const { error: timesError } = await supabase
      .from("available_times")
      .insert(availableTimeRecords);

    if (timesError) throw timesError;

    return { success: true, data: participant };
  } catch (error) {
    console.error("Error adding meeting availability:", error);
    return { success: false, error };
  }
};

// 참가자와 가능 시간 정보를 가져오는 함수
export const fetchMeetingAvailability = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from('meeting_participants')
      .select(`
        *,
        available_times!inner(*)
      `)
      .eq('meeting_id', meetingId)

    if (error) throw error

    return { 
      success: true, 
      data: data 
    }
  } catch (error) {
    console.error('Error fetching meeting availability:', error)
    return { success: false, error }
  }
}
