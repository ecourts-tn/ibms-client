import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route } from "react-router-dom";
/* -------- Components ----------- */
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import Extension from "components/filing/allied/Extension";
import Stepper from "components/filing/stepper/ExtensionStepper";
import StepperButton from "components/filing/StepperButton";


const extensionRoutes = [
    { path: "initial-input", component: <Extension /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const ExtensionLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <Stepper />
                <Outlet />
                <StepperButton steps={extensionRoutes}/>
            </div>
        </div>
    </PrivateRoute>
);

export const ExtensionRoutes = () => (
    <Route path="filing/time-extension/" element={<ExtensionLayout />}>
        {extensionRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

