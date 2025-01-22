import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet,Route } from "react-router-dom";
/* -------- Components ----------- */
import GroundsContainer from "components/filing/Ground";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import PassportStepper from "components/filing/stepper/PassportStepper";
import ReturnPassport from "components/filing/allied/ReturnPassport";
import StepperButton from "components/filing/StepperButton";


const passportRoutes = [
    { path: "initial-input", component: <ReturnPassport /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const ReturnPassportLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <PassportStepper />
                <Outlet />
                <StepperButton steps={passportRoutes}/>
            </div>
        </div>
    </PrivateRoute>
);

export const ReturnPassportRoutes = () => (
    <Route path="filing/return-passport/" element={<ReturnPassportLayout />}>
        {passportRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

