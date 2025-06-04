import React from "react";
import {Route} from "react-router-dom";
import VerifyEmail from "../components/auth/VerifyEmail.tsx";
import HelpPage from "../components/HelpPage.tsx";

const PublicRoutes = (): React.ReactElement => (
    <>
        <Route path="/help" element={<HelpPage />} />
        <Route path="/verify-email" element={<VerifyEmail />}/>
        {/* add other public routes here */}
    </>
);

export default PublicRoutes;