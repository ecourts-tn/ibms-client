import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
<<<<<<< HEAD
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import Relaxation from 'components/filing/relaxation/Relaxation'
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
=======
import { Outlet,Route } from "react-router-dom";
/* -------- Components ----------- */
>>>>>>> deena
import GroundsContainer from "components/filing/Ground";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
<<<<<<< HEAD
import Stepper from "components/filing/return/PassportStepper";
import ReturnPassport from "components/filing/return/ReturnPassport";
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
import PassportStepper from "components/filing/stepper/PassportStepper";
import ReturnPassport from "components/filing/allied/ReturnPassport";
>>>>>>> deena


const passportRoutes = [
    { path: "initial-input", component: <ReturnPassport /> },
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

const ReturnPassportLayout = () => (
    
    <PrivateRoute>
        <div className="container" style={{ minHeight:'500px'}}>
<<<<<<< HEAD
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
=======
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
                <PassportStepper />
>>>>>>> deena
                <Outlet />
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

