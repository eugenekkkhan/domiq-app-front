import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminPage from "./AdminPage";
import AdminAuth from "./AdminAuth";
import { getCookie } from "./utils";

const RouterComponent = () => {
  const isAuthenticated = getCookie("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <AdminAuth />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
