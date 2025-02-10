import { Routes, Route } from "react-router-dom";
import Login from "../app/page/Login";
import Register from "../app/page/Register";

const WebRoute = () => {
  return (
    <Routes>      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default WebRoute;
