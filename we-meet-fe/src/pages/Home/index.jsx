import { useApp } from "../../context/AppContext";
import Home_Desktop from "./Home_Desktop";
import Home_Mobile from "./Home_Mobile";

const HomePage = () => {
    
  const { isMobile } = useApp();

  return <>{isMobile ? <Home_Mobile /> : <Home_Desktop />}</>;
};

export default HomePage;
