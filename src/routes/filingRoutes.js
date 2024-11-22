import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Routes, Route } from "react-router-dom";
/* -------- Components ----------- */
import Logout from 'components/auth/Logout'
import Profile from 'components/auth/Profile'
import ChangePassword from 'components/auth/ChangePassword'
import ResetPassword from 'components/auth/ResetPassword';
import Dashboard from "components/filing/Dashboard"
import DraftList from "components/filing/DraftList"
import PetitionList from "components/filing/PetitionList"
import PetitionDetail from "components/filing/PetitionDetail"
import BailFiling from "components/filing/bail/BailFiling"
import Relaxation from 'components/filing/relaxation/Relaxation'
import IntervenePetition from "components/filing/intervene/NewPetition"
import Surety from 'components/filing/surety/Surety'
import DischargeSurety from 'components/filing/surety/DischargeSurety'
import Extension from 'components/filing/extension/Extension'
import ReturnPassport from 'components/filing/return/ReturnPassport'
import PdfGenerator from "components/filing/PdfGenerator"
import ModificationNew from 'components/filing/modification/ModificationNew'
import ABail from 'components/filing/antibail/ABail';
import ReturnProperty from 'components/filing/return/ReturnProperty';
import InitialInput from "components/InitialInput";
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import PreviousCaseContainer from "components/history/PreviousCaseContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import BailStepper from "components/filing/bail/BailStepper";
import ABailStepper from "components/filing/antibail/ABailStepper"
import StepperButton from "components/filing/bail/StepperButton";

const Litigant = () => {
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}

export const bailRoutes = [
    { path: "initial-input", component: <InitialInput /> },
    { path: "litigant", component: <Litigant /> },
    { path: "ground", component: <GroundsContainer /> },
    { path: "previous-history", component: <PreviousCaseContainer /> },
    { path: "advocate", component: <Advocate /> },
    { path: "document", component: <Document /> },
    { path: "payment", component: <Payment /> },
    { path: "efile", component: <EFile /> },
];

const BailFilingLayout = () => (
    <PrivateRoute>
        <div className="container-fluid" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}>
                    <BailStepper />
                    <Outlet />
                    <StepperButton steps={bailRoutes} />
                </div>
            </div>
        </div>
    </PrivateRoute>
);

export const BailFilingRoutes = () => (
    <Route path="filing/bail" element={<BailFilingLayout />}>
        {bailRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);

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

export const filingRoutes = [
    {   path: "filing/dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },  
    { 
        path:"filing/condition-relaxation",
        element:(
            <PrivateRoute>
                <Relaxation />
            </PrivateRoute>
        )
    },
    {
        path:"filing/modification-petition",
        element:(
            <PrivateRoute>
                <ModificationNew />
            </PrivateRoute>
        )
    },
    {   path:"filing/intervene-petition",
        element:(
            <PrivateRoute>
                <IntervenePetition />
            </PrivateRoute>
        )
    },
    {
        path:"filing/surety-petition",
        element:(
            <PrivateRoute>
                <Surety />
            </PrivateRoute>
        )
    },
    {
        path:"filing/surety/discharge",
        element:(
            <PrivateRoute>
                <DischargeSurety />
            </PrivateRoute>
        )
    },
    {
        path:"filing/extension-time",
        element:(
            <PrivateRoute>
                <Extension></Extension>
            </PrivateRoute>
        )
    },
    {
        path:"filing/return-passport",
        element:(
            <PrivateRoute>
                <ReturnPassport/>
            </PrivateRoute>
        )
    },
    {
        path:"filing/return-property",
        element:(
            <PrivateRoute>
                <ReturnProperty />
            </PrivateRoute>
        )
    },
    {
        path:"pleading",
        element:(
            <PrivateRoute>
                <ReturnProperty/>
            </PrivateRoute>
        )
    },
    {
        path:"filing/draft-list",
        element:(
            <PrivateRoute>
                <DraftList />
            </PrivateRoute>
        )
    },{
        path:"filing/submitted-list",
        element:(
            <PrivateRoute>
                <PetitionList />
            </PrivateRoute>
        )
    },
    { 
        path:"filing/detail",
        element:(
            <PrivateRoute>
                <PetitionDetail />
            </PrivateRoute>
        )
    },
    {
        path:"filing/generate/pdf",
        element:(
            <PrivateRoute>
                <PdfGenerator />
            </PrivateRoute>
        )
    },
    {
        path:"auth/logout",
        element:(
            <PrivateRoute>
                <Logout />
            </PrivateRoute>
        )
    },
    {
        path:"auth/profile",
        element:(
            <PrivateRoute>
                <Profile />
            </PrivateRoute>
        )
    },
    { 
        path:"auth/change-password",
        element:(
            <PrivateRoute>
                <ChangePassword />
            </PrivateRoute>
        )
    },
    {
        path:"auth/reset-password",
        element:(
            <PrivateRoute>
                <ResetPassword />
            </PrivateRoute>
        )
    }

]