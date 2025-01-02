import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route } from "react-router-dom";
/* -------- Components ----------- */
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import SuretyStepper from "components/filing/stepper/SuretyStepper";
import Surety from "components/filing/surety/Surety";
import SuretyForm from "components/filing/surety/SuretyForm";


const suretyRoutes = [
    { path: "initial-input", component: <Surety /> },
    { path: "surety-detail", component: <SuretyForm /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const SuretyLayout = () => (
    
    <PrivateRoute>
        <div className="container-fluid" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <SuretyStepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const SuretyRoutes = () => (
    <Route path="filing/surety-petition/" element={<SuretyLayout />}>
        {suretyRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

