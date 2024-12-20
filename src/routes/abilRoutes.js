import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import InitialInput from "components/InitialInput";
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/filing/Ground";
import PreviousCaseContainer from "components/history/PreviousCaseContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import ABailStepper from "components/filing/antibail/ABailStepper"

const Litigant = () => {
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}


const abailRoutes = [
    { path: "initial-input", component: <InitialInput /> },
    { path: "litigant", component: <Litigant /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "previous-history", component: <PreviousCaseContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const ABailFilingLayout = () => (
    <PrivateRoute>
        <div className="container-fluid" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <ABailStepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const ABailFilingRoutes = () => (
    <Route path="filing/anticipatory-bail" element={<ABailFilingLayout />}>
        {abailRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

