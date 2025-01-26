import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/index";
import CreateSchedulePage from "./pages/schedule/CreateSchedulePage";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateSchedulePage />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </AuthProvider>
  );
}

export default App;
