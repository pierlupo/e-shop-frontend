import React from "react";
import {Route} from "react-router-dom";
import ForgotPassword from "../components/auth/ForgotPassword.tsx";
import ResetPassword from "../components/auth/ResetPassword.tsx";
import VerifyEmail from "../components/auth/VerifyEmail.tsx";
import HelpPage from "../components/HelpPage.tsx";

const PublicRoutes = (): React.ReactElement => (
    <>
        <Route path="/help" element={<HelpPage />} />
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

    </>
);

export default PublicRoutes;