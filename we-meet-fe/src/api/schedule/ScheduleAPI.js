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
// const addParticipantWithTimes = async (participantData) => {
//   try {
//     // 참가자 추가 및 가능 시간 추가를 트랜잭션으로 처리
//     const { data: participant, error: participantError } = await supabase.rpc(
//       "add_participant_with_times",
//       {
//         p_meeting_id: meetingId,
//         p_user_id: userId,
//         p_available_times: availableTimes,
//       }
//     );

//     if (participantError) throw participantError;

//     return participant;
//   } catch (error) {
//     setError(error.message);
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };
