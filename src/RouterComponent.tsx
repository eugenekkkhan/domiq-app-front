import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminPage from "./AdminPage";
import AdminAuth from "./AdminAuth";
import { getCookie } from "./utils";
import ConnectionProblems from "./pages/ConnectionProblems";
import Faq from "./pages/Faq";
import Features from "./pages/Features";

const RouterComponent = () => {
  const isAuthenticated = getCookie("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPage /> : <AdminAuth />}
        />
        <Route path="/connection-problems" element={<ConnectionProblems />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
