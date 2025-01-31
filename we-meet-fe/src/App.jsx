import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "styled-components";
import {theme} from "./styles/theme";
import HomePage from "./pages/home/index";
import CreateSchedulePage from "./pages/schedule/CreateSchedulePage";
import ScheduleDetailPage from "./pages/schedule/ScheduleDetailPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/meeting">
                <Route path="create" element={<CreateSchedulePage />} />
                <Route path=":id" element={<ScheduleDetailPage />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
