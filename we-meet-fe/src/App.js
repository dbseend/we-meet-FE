import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GoogleLogin from "./components/auth/GoogleLogin";
import CreateMeetingPage from "./components/meeting/CreateMeetingPage";
import MeetingScheduler from "./components/meeting/MeetingScheduler";
import OnBoarding from "./components/onBoarding/OnBoarding";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<OnBoarding />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/meeting">
            <Route path="create" element={<CreateMeetingPage />} />
            <Route path=":id" element={<MeetingScheduler />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
