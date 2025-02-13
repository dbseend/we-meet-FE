import { supabase } from "../supabase/supabaseClient";

export const GoogleLogin = async (redirectTo) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        redirectTo === ""
          ? process.env.REACT_APP_SITE_URL
          : `${process.env.REACT_APP_SITE_URL}${redirectTo}`, // 구글 캘린더 API 스코프 추가
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    },
  });
};
