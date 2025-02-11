import Footer_Mobile from "./mobile/Footer_Mobile";
import Header_Mobile from "./mobile/Header_Mobile";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header_Mobile />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer_Mobile />
    </div>
  );
};

export default Layout;
