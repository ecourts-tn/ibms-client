import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import DischargeStepper from "components/filing/surety/DischargeStepper";
import Surety from "components/filing/surety/Surety";
import DischargeSurety from "components/filing/surety/DischargeSurety";
import SuretyDetails from "components/filing/surety/SuretyDetails";


const dischargeRoutes = [
    { path: "initial-input", component: <DischargeSurety /> },
    { path: "surety-detail", component: <SuretyDetails /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const DischargeLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <DischargeStepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const DischargeRoutes = () => (
    <Route path="filing/surety-discharge/" element={<DischargeLayout />}>
        {dischargeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

