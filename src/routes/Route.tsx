import { Routes, Route } from "react-router-dom";
import Login from "../app/page/Login";
import Register from "../app/page/Register";
import Layout from "../app/layout/Layout";
import Home from "../app/page/Home";
import FormSubmission from "../app/page/FormSubmission";
import DocumentList from "../app/page/DocumentList";

const WebRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/form-submission" element={<FormSubmission />} />
        <Route path="/document-list" element={<DocumentList/>}/>
      </Routes>
    </Layout>
  );
};

export default WebRoute;
