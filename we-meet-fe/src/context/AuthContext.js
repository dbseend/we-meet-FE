import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api/supabase/supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인 - 한 번만 호출
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      const user = session?.user;
      setUser(user ?? null);

      if (user) {
        checkAndSaveFirstLogin(user).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAndSaveFirstLogin = async (user) => {
    try {
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id);

      if (selectError) {
        console.error("사용자 조회 오류:", selectError);
        return;
      }

      console.log(existingUser);

      if (existingUser.length === 0) {
        console.log("첫 로그인");
        const { data: insertData, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              user_id: user.id,
              email: user.email,
              name: user.user_metadata.name,
            },
          ])
          .select();

        if (insertError) {
          console.error("사용자 정보 삽입 오류:", insertError);
          return;
        }

        console.log("삽입된 데이터:", insertData);
        console.log("첫 로그인 사용자 정보가 DB에 저장되었습니다.");
      }
    } catch (error) {
      console.error("첫 로그인 사용자 정보 확인 및 저장 중 오류 발생:", error);
    }
  };
  // 로그아웃
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
