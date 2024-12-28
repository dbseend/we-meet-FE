import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/auth/Dashboard";
import GoogleLogin from "./components/auth/GoogleLogin";
import { useAuth } from "./context/AuthContext";
import CreateMeetingPage from "./components/meeting/CreateMeetingPage";
import MeetingScheduler from "./components/meeting/MeetingScheduler"; // 추가

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GoogleLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateMeetingPage />} />
      <Route path="/meeting/:id" element={<MeetingScheduler />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
