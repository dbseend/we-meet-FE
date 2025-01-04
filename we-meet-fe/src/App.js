import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GoogleLogin from "./components/auth/GoogleLogin";
import CreateMeetingPage from "./pages/meeting/create/CreateMeetingPage";
import OnBoardingPage from "./pages/onBoarding/OnBoardingPage";
import MeetingSchedulerPage from "./pages/meeting/schedule/MeetingSchedulerPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OnBoardingPage />} />
            <Route path="/login" element={<GoogleLogin />} />
            <Route path="/meeting">
              <Route path="create" element={<CreateMeetingPage />} />
              <Route path=":id" element={<MeetingSchedulerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
