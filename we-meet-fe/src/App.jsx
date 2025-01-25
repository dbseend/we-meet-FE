import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import HomePage from "./pages/Home/index";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <AppProvider>
      {/* <GlobalStyle> */}
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </Layout>
      {/* </GlobalStyle> */}
    </AppProvider>
  );
}

export default App;
