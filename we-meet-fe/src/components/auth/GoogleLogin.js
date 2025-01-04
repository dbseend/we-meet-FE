import { useState } from "react";
import { ReactComponent as SignIn } from "../../assets/sign-in/web_light_rd_ctn.svg";
import { supabase } from "../../lib/supabaseClient";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.REACT_APP_SITE_URL,
          // 구글 캘린더 API 스코프 추가
          scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
        },
      });

      if (error) throw error;
    } catch (error) {
      console.log(error.message);
    }
  };

  return <SignIn onClick={handleGoogleLogin} disabled={loading} />;
};

export default GoogleLogin;
