import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import NewPetition from "components/filing/intervene/NewPetition";
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import Stepper from "components/filing/intervene/Stepper";
import Petitioner from "components/filing/intervene/Petitioner";
import AccusedDetails from "components/filing/intervene/AccusedDetails";

const Litigant = () => {
    
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}



const interveneRoutes = [
    { path: "initial-input", component: <NewPetition /> },
    { path: "petitioner", component: <Petitioner />},
    { path: "accused-detail", component: <AccusedDetails />},
    { path: "litigant", component: <Litigant /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const InterveneLayout = () => (
    
    <PrivateRoute>
        <div className="container-fluid" style={{ minHeight:'500px'}}>
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

export const InterveneRoutes = () => (
    <Route path="filing/intervene-petition/" element={<InterveneLayout />}>
        {interveneRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

