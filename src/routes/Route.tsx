import { Routes, Route } from "react-router-dom";
import Login from "../app/page/Login";

const WebRoute = () => {
  return (
    <Routes>      
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default WebRoute;
