import { useResponsiveState } from "../../hooks/useResponsiveState";
import Header_Desktop from "./desktop/Header_Desktop";
import Header_Mobile from "./mobile/Header_Mobile";
import Footer_Desektop from "./desktop/Footer_Desktop";
import Footer_Mobile from "./mobile/Footer_Mobile";

const Layout = ({ children }) => {
  const { isMobile } = useResponsiveState();

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? <Header_Mobile /> : <Header_Desktop />}
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      {isMobile ? <Footer_Mobile /> : <Footer_Desektop />}
    </div>
  );
};

export default Layout;
