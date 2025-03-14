import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import FilingLayout from "components/layout/public/FilingLayout";
import { Logout, Profile, ChangePassword, ResetPassword } from "components/auth";
import { Dashboard, DraftList, SubmittedList, PetitionDetail, PdfGenerator, 
    Pleadings, ApprovedList, ReturnedList, ProceedingDetail, Advocate, Grounds,
    Document,Initial } from "components/filing";
import { PetitionerContainer, RespondentContainer, 
    PreviousCaseContainer, EFile } from "components";
import { Relaxation, Modification, Extension, ReturnPassport, ReturnProperty } from "components/filing/allied";
import { Petition, AccusedDetails } from "components/filing/intervene";
import { Surety, SuretyForm, DischargeSurety, SuretyDetails } from "components/filing/surety";
import { Payment } from "components/payment";
import Allied from "components/filing/allied/Allied";


const bailRoutes = [
    { id: 1, path: "initial-input", component: <Initial />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <PetitionerContainer />, name:"petitioners" },
    { id: 3, path: "respondent", component: <RespondentContainer />, name:"respondents" },
    { id: 4, path: "ground", component: <Grounds />, name:"ground" },
    { id: 5, path: "previous-history", component: <PreviousCaseContainer />, name:"previous_case_details" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <EFile />, name:"efile" },
];

const abailRoutes = [
    { id: 1, path: "initial-input", component: <Initial />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <PetitionerContainer />, name:"petitioners" },
    { id: 3, path: "respondent", component: <RespondentContainer />, name:"respondents" },
    { id: 4, path: "ground", component: <Grounds />, name:"ground" },
    { id: 5, path: "previous-history", component: <PreviousCaseContainer />, name:"previous_case_details" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <EFile />, name:"efile" },
];

const conditionRoutes = [
    { id: 1, path: "main-case-detail", component: <Relaxation />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const alliedRoutes = [
    { id: 1, path: "main-case-detail", component: <Allied />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const interveneRoutes = [
    { id: 1, path: "initial-input", component: <Petition />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <PetitionerContainer />, name:"petitioners" },
    { id: 3, path: "accused", component: <AccusedDetails />, name:"accused_details" },
    { id: 4, path: "respondent", component: <RespondentContainer />, name:"respondents" },
    { id: 5, path: "ground", component: <Grounds />, name:"ground" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <EFile />, name:"efile" },
];

const modificationRoutes = [
    { id: 1, path: "main-case-detail", component: <Modification />, name:"main_case_detail"},
    { id: 1, path: "allied", component: <Allied />, name:"allied"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const suretyRoutes = [
    { id: 1, path: "main-case-detail", component: <Surety />, name:"basic_details"},
    { id: 2, path: "surety-detail", component: <SuretyForm />, name:"surety_details" },
    { id: 3, path: "ground", component: <Grounds />, name:"ground" },
    { id: 4, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 5, path: "document", component: <Document />, name:"upload_document" },
    { id: 6, path: "payment", component: <Payment />, name:"payment" },
    { id: 7, path: "efile", component: <EFile />, name:"efile" },
];

const dischargeRoutes = [
    { id: 1, path: "main-case-detail", component: <DischargeSurety />, name:"basic_details"},
    { id: 2, path: "surety-detail", component: <SuretyDetails />, name:"surety_details" },
    { id: 3, path: "ground", component: <Grounds />, name:"ground" },
    { id: 4, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 5, path: "document", component: <Document />, name:"upload_document" },
    { id: 6, path: "payment", component: <Payment />, name:"payment" },
    { id: 7, path: "efile", component: <EFile />, name:"efile" },
];

const extensionRoutes = [
    { id: 1, path: "main-case-detail", component: <Extension />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const passportRoutes = [
    { id: 1, path: "main-case-detail", component: <ReturnPassport />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const propertyRoutes = [
    { id: 1, path: "main-case-detail", component: <ReturnProperty />, name:"main_case_detail"},
    { id: 2, path: "ground", component: <Grounds />, name:"ground" },
    { id: 3, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 4, path: "document", component: <Document />, name:"upload_document" },
    { id: 5, path: "payment", component: <Payment />, name:"payment" },
    { id: 6, path: "efile", component: <EFile />, name:"efile" },
];

const routesConfig = [
    { path: "filing/bail", routes: "bailRoutes", title: "bail" },
    { path: "filing/anticipatory-bail", routes: "abailRoutes", title: "abail" },
    { path: "filing/relaxation", routes: "conditionRoutes", title: "condition_relaxation" },
    { path: "filing/intervene", routes: "interveneRoutes", title: "intervene" },
    { path: "filing/modification", routes: "modificationRoutes", title: "modification" },
    { path: "filing/surety", routes: "suretyRoutes", title: "surety" },
    { path: "filing/surety-discharge", routes: "dischargeRoutes", title: "discharge_surety" },
    { path: "filing/extension", routes: "extensionRoutes", title: "extension" },
    { path: "filing/return-passport", routes: "passportRoutes", title: "return_passport" },
    { path: "filing/return-property", routes: "propertyRoutes", title: "return_property" },
    { path: "filing/allied", routes: "alliedRoutes", title: "allied" }
];

export const FilingRoutes = () => {
    const routeMappings = {
        bailRoutes,
        abailRoutes,
        conditionRoutes,
        alliedRoutes,
        interveneRoutes,
        modificationRoutes,
        suretyRoutes,
        dischargeRoutes,
        extensionRoutes,
        passportRoutes,
        propertyRoutes,
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
                { path: "filing/pleadings", element: <Pleadings /> },
                { path: "filing/draft", element: <DraftList /> },
                { path: "filing/submitted", element: <SubmittedList /> },
                { path: "filing/approved", element: <ApprovedList /> },
                { path: "filing/returned", element: <ReturnedList /> },
                { path: "filing/detail", element: <PetitionDetail /> },
                { path: "proceeding/detail", element: <ProceedingDetail /> },
                { path: "filing/generate/pdf", element: <PdfGenerator /> },
                { path: "auth/logout", element: <Logout /> },
                { path: "auth/profile", element: <Profile /> },
                { path: "auth/change-password", element: <ChangePassword /> },
            ].map(({ path, element, private: isPrivate = true }, index) => (
                <Route key={index} path={path} element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element} />
            ))}
        </>
    );
};
