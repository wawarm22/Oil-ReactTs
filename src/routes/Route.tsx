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
import ResetPassword from "../app/page/ResetPassword";
import MatchList from "../app/page/MatchList";
import MatchDocument from "../app/page/MatchDocument";
import TaxSubmission from "../app/page/TaxSubmission";
import UploadPreparation from "../app/page/UploadPreparation";
import TestPage from "../app/page/test/testPage";

const WebRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/form-submission" element={<FormSubmission />} />
        <Route path="/document-list" element={<DocumentList />} />
        <Route path="/pre-upload" element={<UploadPreparation />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload-multiple" element={<UploadMultiple />} />
        <Route path="/confirm" element={<ConfirmUpload />} />
        <Route path="/audit" element={<DocumentAudit />} />
        <Route path="/match-list" element={<MatchList />} />
        <Route path="/match-document" element={<MatchDocument />} />
        <Route path="/submit" element={<TaxSubmission />} />
      </Routes>
    </Layout>
  );
};

export default WebRoute;
