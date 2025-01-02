import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route } from "react-router-dom";
/* -------- Components ----------- */
<<<<<<< HEAD
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
=======
>>>>>>> deena
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import Stepper from "components/filing/stepper/ModificationStepper";
import Modification from "components/filing/allied/Modification";

const modificationRoutes = [
    { path: "initial-input", component: <Modification /> },
<<<<<<< HEAD
    // { path: "litigant", component: <Litigant /> },
=======
>>>>>>> deena
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const ModificationLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <Stepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const ModificationFilingRoutes = () => (
    <Route path="filing/modification-petition/" element={<ModificationLayout />}>
        {modificationRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

