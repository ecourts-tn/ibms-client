import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route } from "react-router-dom";
/* -------- Components ----------- */
import Logout from 'components/auth/Logout'
import Profile from 'components/auth/Profile'
import ChangePassword from 'components/auth/ChangePassword'
import ResetPassword from 'components/auth/ResetPassword';
import Dashboard from "components/filing/Dashboard"
import DraftList from "components/filing/DraftList"
import SubmittedList from "components/filing/SubmittedList"
import PetitionDetail from "components/filing/PetitionDetail"
import PdfGenerator from "components/filing/PdfGenerator"
import InitialInput from "components/InitialInput1";
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import PreviousCaseContainer from "components/history/PreviousCaseContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import BailStepper from "components/filing/stepper/BailStepper";
// import ABailStepper from "components/filing/stepper/ABailStepper"
import StepperButton from "components/filing/StepperButton";
import Pleadings from "components/filing/Pleadings";
import ApprovedList from "components/filing/ApprovedList";
import ReturnedList from "components/filing/ReturnedList";
import ProceedingDetail from "components/filing/ProceedingDetail";

const Litigant = () => {
    return(
        <>
            <PetitionerContainer />
            <RespondentContainer />
        </>
    )
}

// export const bailRoutes = [
//     { path: "initial-input", component: <InitialInput /> },
//     { path: "litigant", component: <Litigant /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "previous-history", component: <PreviousCaseContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const BailFilingLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}>
//                     <BailStepper />
//                     <Outlet />
//                     <StepperButton steps={bailRoutes} />
//                 </div>
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const BailFilingRoutes = () => (
//     <Route path="filing/bail" element={<BailFilingLayout />}>
//         {bailRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const abailRoutes = [
//     { path: "initial-input", component: <InitialInput /> },
//     { path: "litigant", component: <Litigant /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "previous-history", component: <PreviousCaseContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ABailFilingLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <ABailStepper />
//                 <Outlet />
//                 <StepperButton steps={abailRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ABailFilingRoutes = () => (
//     <Route path="filing/anticipatory-bail" element={<ABailFilingLayout />}>
//         {abailRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const conditionRoutes = [
//     { path: "initial-input", component: <Relaxation /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ConditionFilingLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <RelaxationStepper />
//                 <Outlet />
//                 <StepperButton steps={conditionRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ConditionFilingRoutes = () => (
//     <Route path="filing/condition-relaxation" element={<ConditionFilingLayout />}>
//         {conditionRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const interveneRoutes = [
//     { path: "initial-input", component: <Petition /> },
//     { path: "petitioner", component: <Petitioner />},
//     { path: "accused-detail", component: <AccusedDetails />},
//     { path: "litigant", component: <Litigant /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const InterveneLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <InterveneStepper />
//                 <Outlet />
//                 <StepperButton steps={interveneRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const InterveneRoutes = () => (
//     <Route path="filing/intervene-petition" element={<InterveneLayout />}>
//         {interveneRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const modificationRoutes = [
//     { path: "initial-input", component: <Modification /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ModificationLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <ModificationStepper />
//                 <Outlet />
//                 <StepperButton steps={modificationRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ModificationFilingRoutes = () => (
//     <Route path="filing/modification-petition" element={<ModificationLayout />}>
//         {modificationRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const suretyRoutes = [
//     { path: "initial-input", component: <Surety /> },
//     { path: "surety-detail", component: <SuretyForm /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const SuretyLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <SuretyStepper />
//                 <Outlet />
//                 <StepperButton steps={suretyRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const SuretyRoutes = () => (
//     <Route path="filing/surety-petition" element={<SuretyLayout />}>
//         {suretyRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const dischargeRoutes = [
//     { path: "initial-input", component: <DischargeSurety /> },
//     { path: "surety-detail", component: <SuretyDetails /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const DischargeLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <DischargeStepper />
//                 <Outlet />
//                 <StepperButton steps={dischargeRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const DischargeRoutes = () => (
//     <Route path="filing/surety-discharge" element={<DischargeLayout />}>
//         {dischargeRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const extensionRoutes = [
//     { path: "initial-input", component: <Extension /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ExtensionLayout = () => (
//     <PrivateRoute>
//         <div className="container-fluid" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <ExtensionStepper />
//                 <Outlet />
//                 <StepperButton steps={extensionRoutes} />
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ExtensionRoutes = () => (
//     <Route path="filing/time-extension" element={<ExtensionLayout />}>
//         {extensionRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const passportRoutes = [
//     { path: "initial-input", component: <ReturnPassport /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ReturnPassportLayout = () => (
    
//     <PrivateRoute>
//         <div className="container" style={{ minHeight:'500px'}}>
//             <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <PassportStepper />
//                 <Outlet />
//                 <StepperButton steps={passportRoutes}/>
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ReturnPassportRoutes = () => (
//     <Route path="filing/return-passport/" element={<ReturnPassportLayout />}>
//         {passportRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );

// const propertyRoutes = [
//     { path: "initial-input", component: <ReturnProperty /> },
//     { path: "ground", component: <GroundsContainer /> },
//     { path: "advocate", component: <Advocate /> },
//     { path: "document", component: <Document /> },
//     { path: "payment", component: <Payment /> },
//     { path: "efile", component: <EFile /> },
// ];

// const ReturnPropertyLayout = () => (
    
//     <PrivateRoute>
//         <div className="container" style={{ minHeight:'500px'}}>
//            <div className="card" style={{ boxShadow:'none', border:'none'}}>
//                 <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div>
//                 <PropertyStepper />
//                 <Outlet />
//                 <StepperButton steps={propertyRoutes.map(route => ({ path: route.path }))}/>
//             </div>
//         </div>
//     </PrivateRoute>
// );

// export const ReturnPropertyRoutes = () => (
//     <Route path="filing/return-property/" element={<ReturnPropertyLayout />}>
//         {propertyRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.component} />
//         ))}
//     </Route>
// );
export const filingRoutes = [
    {   path: "filing/dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },  
    {
        path:"filing/pleadings",
        element:(
            <PrivateRoute>
                <Pleadings/>
            </PrivateRoute>
        )
    },
    {
        path:"filing/draft",
        element:(
            <PrivateRoute>
                <DraftList />
            </PrivateRoute>
        )
    },
    {
        path:"filing/submitted",
        element:(
            <PrivateRoute>
                <SubmittedList />
            </PrivateRoute>
        )
    },
    {
        path:"filing/approved",
        element:(
            <PrivateRoute>
                <ApprovedList />
            </PrivateRoute>
        )
    },
    {
        path:"filing/returned",
        element:(
            <PrivateRoute>
                <ReturnedList />
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
        path:"proceeding/detail",
        element:(
            <PrivateRoute>
                <ProceedingDetail />
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
        element: <ResetPassword />
    }

]