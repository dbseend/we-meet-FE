import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GoogleLogin from "./components/auth/GoogleLogin";
import CreateMeetingPage from "./pages/meeting/create/CreateMeetingPage";
import OnBoardingPage from "./pages/onBoarding/OnBoardingPage";
import MeetingSchedulerPage from "./pages/meeting/schedule/MeetingSchedulerPage";
import { GoogleCalendarProvider } from "./context/GoogleCalendarContext";
import MeetingList from "./components/user/MeetingList";

function App() {
  return (
    <AuthProvider>
      <GoogleCalendarProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<OnBoardingPage />} />
              <Route path="/login" element={<GoogleLogin />} />
              <Route path="/myPage" element={<MeetingList />} />
              <Route path="/meeting">
                <Route path="create" element={<CreateMeetingPage />} />
                <Route path=":id" element={<MeetingSchedulerPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </GoogleCalendarProvider>
    </AuthProvider>
  );
}

export default App;
