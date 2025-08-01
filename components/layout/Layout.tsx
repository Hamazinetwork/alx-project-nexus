import Header from "./Header";
import Footer from "./Footer";
import { layoutProps } from "@/interfaces";

const Layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;