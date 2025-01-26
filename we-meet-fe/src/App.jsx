import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/index";
import CreateSchedulePage from "./pages/schedule/CreateSchedulePage";

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
      <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateSchedulePage />} />
          </Routes>
      </Layout>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
