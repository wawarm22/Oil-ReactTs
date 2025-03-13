import { Routes, Route } from "react-router-dom";
import Login from "../app/page/Login";
import Register from "../app/page/Register";
import Layout from "../app/layout/Layout";
import Home from "../app/page/Home";
import FormSubmission from "../app/page/FormSubmission";
import DocumentList from "../app/page/DocumentList";
import Upload from "../app/page/Upload";
import UploadMultiple from "../app/page/UploadMultiple";
import ConfirmUpload from "../app/page/ConfirmUpload";
import DocumentAudit from "../app/page/DocumentAudit";
import ForgotPassword from "../app/page/ForgotPassword";

const WebRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/form-submission" element={<FormSubmission />} />
        <Route path="/document-list" element={<DocumentList/>}/>
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload-multiple" element={<UploadMultiple />} />
        <Route path="/confirm" element={<ConfirmUpload />} />
        <Route path="/audit" element={<DocumentAudit />} />
      </Routes>
    </Layout>
  );
};

export default WebRoute;
