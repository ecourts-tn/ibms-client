import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/filing/Ground";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import Stepper from "components/filing/return/PropertyStepper";
import ReturnProperty from "components/filing/return/ReturnProperty";
import { useTranslation } from "react-i18next";

const Litigant = () => {
    
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}



const propertyRoutes = [
    { path: "initial-input", component: <ReturnProperty /> },
    // { path: "litigant", component: <Litigant /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const ReturnPropertyLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
            {/* <nav aria-label="breadcrumb" className="mt-2 mb-1">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                    <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('condition')}</li>
                </ol>
            </nav> */}
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <Stepper />
                <Outlet />
            </div>
        </div>
    </PrivateRoute>
);

export const ReturnPropertyRoutes = () => (
    <Route path="filing/return-property/" element={<ReturnPropertyLayout />}>
        {propertyRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

