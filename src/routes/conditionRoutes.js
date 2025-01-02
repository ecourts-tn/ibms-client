import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route } from "react-router-dom";
/* -------- Components ----------- */
<<<<<<< HEAD
import Relaxation from 'components/filing/relaxation/Relaxation'
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
=======
import Relaxation from 'components/filing/allied/Relaxation'
>>>>>>> deena
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
<<<<<<< HEAD
import Stepper from "components/filing/relaxation/Stepper";
import { useTranslation } from "react-i18next";

const Litigant = () => {
    
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}

=======
import RelaxationStepper from "components/filing/stepper/RelaxationStepper";
>>>>>>> deena


const conditionRoutes = [
    { path: "initial-input", component: <Relaxation /> },
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

const ConditionLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <RelaxationStepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const ConditionFilingRoutes = () => (
    <Route path="filing/condition-relaxation/" element={<ConditionLayout />}>
        {conditionRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

