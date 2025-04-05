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
import AuthRoute from "./middleware/AuthRoute";
import SearchFileUpload from "../app/page/SearchFileUpload";

const WebRoute = () => {
  return (
    <Layout>
      <Routes>
        {/* GUEST ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* AUTH ROUTES */}
        <Route path="/" element={<AuthRoute children={(<Home />)} />} />
        <Route path="/search-file" element={<AuthRoute children={(<SearchFileUpload />)} />} />
        <Route path="/form-submission" element={<AuthRoute children={(<FormSubmission />)} />} />
        <Route path="/document-list" element={<AuthRoute children={(<DocumentList />)} />} />
        <Route path="/pre-upload" element={<AuthRoute children={(<UploadPreparation />)} />} />
        <Route path="/upload" element={<AuthRoute children={(<Upload />)} />} />
        <Route path="/upload-multiple" element={<AuthRoute children={(<UploadMultiple />)} />} />
        <Route path="/confirm" element={<AuthRoute children={(<ConfirmUpload />)} />} />
        <Route path="/audit" element={<AuthRoute children={(<DocumentAudit />)} />} />
        <Route path="/match-list" element={<AuthRoute children={(<MatchList />)} />} />
        <Route path="/match-document" element={<AuthRoute children={(<MatchDocument />)} />} />
        <Route path="/submit" element={<AuthRoute children={(<TaxSubmission />)} />} />
      </Routes>
    </Layout>
  );
};

export default WebRoute;
