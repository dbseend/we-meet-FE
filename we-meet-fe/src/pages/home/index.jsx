import { useResponsiveState } from "../../hooks/useResponsiveState";
import Home_Desktop from "./Home_Desktop";
import Home_Mobile from "./Home_Mobile";

const HomePage = () => {
  const { isMobile } = useResponsiveState();

  return <>{isMobile ? <Home_Mobile /> : <Home_Desktop />}</>;
};

export default HomePage;
