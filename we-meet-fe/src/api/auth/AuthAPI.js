import { supabase } from "../supabase/supabaseClient";

export const GoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: process.env.REACT_APP_SITE_URL,
      // 구글 캘린더 API 스코프 추가
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    },
  });
};
