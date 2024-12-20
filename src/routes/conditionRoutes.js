import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import Relaxation from 'components/filing/allied/Relaxation'
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import RelaxationStepper from "components/filing/stepper/RelaxationStepper";


const Litigant = () => {
    
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}

const conditionRoutes = [
    { path: "initial-input", component: <Relaxation /> },
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

