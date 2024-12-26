// src/api/meetingApi.js
import { supabase } from '../lib/supabaseClient';

// 고유 ID 생성 함수
const generateUniqueId = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idLength = 10;
  let result = '';
  
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  
  return result;
};

// 미팅 생성 API
export const createMeeting = async (meetingData) => {
  try {
    const uniqueId = generateUniqueId();
    const meetingUrl = `${window.location.origin}/meeting/${uniqueId}`;

    const { data, error } = await supabase
      .from('meetings')
      .insert([
        {
          id: uniqueId,
          title: meetingData.title,
          description: meetingData.description,
          dates: meetingData.dates,
          time_range: meetingData.timeRange,
          url: meetingUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0],
      url: meetingUrl
    };
  } catch (error) {
    console.error('Error creating meeting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 미팅 조회 API
export const getMeeting = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 미팅 목록 조회 API
export const getMeetings = async () => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 미팅 업데이트 API
export const updateMeeting = async (meetingId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .update({
        title: updateData.title,
        description: updateData.description,
        dates: updateData.dates,
        time_range: updateData.timeRange,
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
    };
  } catch (error) {
    console.error('Error updating meeting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 미팅 삭제 API
export const deleteMeeting = async (meetingId) => {
  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};