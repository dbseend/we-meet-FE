import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.REACT_APP_SITE_URL,
          // 구글 캘린더 API 스코프 추가
          scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
        },
      });

      if (error) throw error;

      // 로그인 성공 후 액세스 토큰을 백엔드로 전송
      const session = await supabase.auth.getSession();
      const accessToken = session?.data?.session?.provider_token;

      // 백엔드로 토큰 전송
      await axios.post("http://your-backend-url/api/auth/google", {
        accessToken: accessToken,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="google-login-button"
      >
        {loading ? "Loading..." : "Sign in with Google"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GoogleLogin;
