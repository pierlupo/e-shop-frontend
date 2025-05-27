import React from "react";
import {Route} from "react-router-dom";
import HelpPage from "../components/HelpPage.tsx";

const PublicRoutes = (): React.ReactElement => (
    <>
        <Route path="/help" element={<HelpPage />} />
        {/* add other public routes here */}
    </>
);

export default PublicRoutes;