import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import FilingLayout from "components/layout/public/FilingLayout";
import { Logout, Profile, ChangePassword } from "components/auth";
import { Dashboard, DraftList, SubmittedList, PdfGenerator, 
    ApprovedList, ReturnedList, ProceedingDetail, Advocate, Grounds,PreviousCaseHistory,
    Petitioner, Respondent, Document, Initial, Declaration } from "components/filing";
import Pleadings from "components/Pleadings";
import { InitialInput, Accused, IntevenePetitioner } from "components/filing/intervene";
import { Surety, SuretyForm, DischargeSurety, SuretyDetails } from "components/filing/surety";
import Payment from "components/filing/Payment";
import Allied from "components/filing/Allied";
import ListedPetition from "components/filing/ListedPetition";
import ResponsePending from "components/filing/ResponsePending";
import ResponseSubmitted from "components/filing/ResponseSubmitted";
import ResponseCreate from "components/filing/ResponseCreate";


const bailRoutes = [
    { id: 1, path: "initial-input", component: <Initial />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <Petitioner />, name:"petitioners" },
    { id: 3, path: "respondent", component: <Respondent />, name:"respondents" },
    { id: 4, path: "ground", component: <Grounds />, name:"ground" },
    { id: 5, path: "previous-history", component: <PreviousCaseHistory />, name:"previous_case_details" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <Declaration />, name:"efile" },
];

const abailRoutes = [
    { id: 1, path: "initial-input", component: <Initial />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <Petitioner />, name:"petitioners" },
    { id: 3, path: "respondent", component: <Respondent />, name:"respondents" },
    { id: 4, path: "ground", component: <Grounds />, name:"ground" },
    { id: 5, path: "previous-history", component: <PreviousCaseHistory />, name:"previous_case_details" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <Declaration />, name:"efile" },
];

const alliedRoutes = [
    { id: 1, path: "main-case-detail", component: <Allied />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <Declaration />, name:"efile" },
];

const pleadingRoutes = [
    { id: 1, path: "", component: <Pleadings />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "document", component: <Document />, name:"upload_document" },
    { id: 4, path: "efile", component: <Declaration />, name:"efile" },
];

const interveneRoutes = [
    { id: 1, path: "initial-input", component: <InitialInput />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <IntevenePetitioner />, name:"petitioners" },
    { id: 3, path: "accused", component: <Accused />, name:"accused_details" },
    { id: 4, path: "respondent", component: <Respondent />, name:"respondents" },
    { id: 5, path: "ground", component: <Grounds />, name:"ground" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <Declaration />, name:"efile" },
];


const suretyRoutes = [
    { id: 1, path: "main-case-detail", component: <Surety />, name:"basic_details"},
    { id: 2, path: "surety-detail", component: <SuretyForm />, name:"surety_details" },
    { id: 3, path: "ground", component: <Grounds />, name:"ground" },
    { id: 4, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 5, path: "document", component: <Document />, name:"upload_document" },
    { id: 6, path: "payment", component: <Payment />, name:"payment" },
    { id: 7, path: "efile", component: <Declaration />, name:"efile" },
];

const dischargeRoutes = [
    { id: 1, path: "main-case-detail", component: <DischargeSurety />, name:"basic_details"},
    { id: 2, path: "surety-detail", component: <SuretyDetails />, name:"surety_details" },
    { id: 3, path: "ground", component: <Grounds />, name:"ground" },
    { id: 4, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 5, path: "document", component: <Document />, name:"upload_document" },
    { id: 6, path: "payment", component: <Payment />, name:"payment" },
    { id: 7, path: "efile", component: <Declaration />, name:"efile" },
];


const routesConfig = [
    { path: "filing/bail", routes: "bailRoutes", title: "bail" },
    { path: "filing/anticipatory-bail", routes: "abailRoutes", title: "abail" },
    { path: "filing/intervene", routes: "interveneRoutes", title: "intervene" },
    { path: "filing/surety", routes: "suretyRoutes", title: "surety" },
    { path: "filing/surety-discharge", routes: "dischargeRoutes", title: "discharge_surety" },
    { path: "filing/allied", routes: "alliedRoutes", title: "allied" },
    { path: "filing/pleadings", routes: "pleadingRoutes", title: "pleading" }
];

export const FilingRoutes = () => {


    const routeMappings = {
        bailRoutes,
        abailRoutes,
        alliedRoutes,
        pleadingRoutes,
        interveneRoutes,
        suretyRoutes,
        dischargeRoutes,
    };

    return (
        <>
            {routesConfig.map(({ path, routes, title }, index) => {
                const routeList = routeMappings[routes]; // Get the actual array
                return (
                    <Route key={index} path={path} element={<FilingLayout routes={routeList} title={title} />}>
                        {routeList.map((route, i) => (
                            <Route key={i} path={route.path} element={route.component} />
                        ))}
                    </Route>
                );
            })}

            {[
                { path: "filing/dashboard", element: <Dashboard /> },
                // { path: "filing/pleadings", element: <Pleadings /> },
                { path: "filing/draft", element: <DraftList /> },
                { path: "filing/submitted", element: <SubmittedList /> },
                { path: "filing/approved", element: <ApprovedList /> },
                { path: "filing/returned", element: <ReturnedList /> },
                { path: "proceeding/detail", element: <ProceedingDetail /> },
                { path: "filing/generate/pdf", element: <PdfGenerator /> },
                { path: "auth/logout", element: <Logout /> },
                { path: "auth/profile", element: <Profile /> },
                { path: "auth/change-password", element: <ChangePassword /> },
                { path: "filing/cases/", element:<ListedPetition />},
                { path: "pp-remarks/pending/", element:<ResponsePending />},
                { path: "pp-remarks/submitted/", element:<ResponseSubmitted />},
                { path: "pp-remarks/", element:<ResponseCreate />}
            ].map(({ path, element, private: isPrivate = true }, index) => (
                <Route key={index} path={path} element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element} />
            ))}
        </>
    );
};
