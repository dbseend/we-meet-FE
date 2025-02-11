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
export const addMeetingAvailability = async (meetingState) => {
  console.log(meetingState);
  try {
    // 1. 참가자 데이터 준비
    const participantData = {
      meeting_id: meetingState.meeting_id,
      user_id: meetingState.user_id,
      anonymous_user_id: meetingState.anonymous_user_id,
      user_name: meetingState.user_name,
    };

    // 2. 참가자 추가 및 ID 받기
    const { data: participant, error: participantError } = await supabase
      .from("meeting_participants")
      .insert([participantData])
      .select("participant_id")
      .single();

    if (participantError) throw participantError;

    // 3. 가능 시간 데이터 준비
    const availableTimeRecords = meetingState.available_times.map((time) => ({
      participant_id: participant.participant_id, // 새로 생성된 participant_id 사용
      available_time: time.available_time,
      priority: time.priority,
    }));
    console.log(availableTimeRecords);

    // 4. 가능 시간 추가
    const { error: timesError } = await supabase
      .from("available_times")
      .insert(availableTimeRecords);

    if (timesError) throw timesError;

    // 5. 성공 시 참가자 정보와 가능 시간 정보 모두 반환
    return {
      success: true,
      data: {
        ...participant,
        availiable_times: availableTimeRecords,
      },
    };
  } catch (error) {
    console.error("Error adding meeting availability:", error);
    return { success: false, error };
  }
};

// 참가자와 가능 시간 정보를 가져오는 함수
export const fetchMeetingAvailability = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from("meeting_participants")
      .select(
        `
        *,
        available_times!inner(*)
      `
      )
      .eq("meeting_id", meetingId);

    if (error) throw error;

    console.log(data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching meeting availability:", error);
    return { success: false, error };
  }
};
