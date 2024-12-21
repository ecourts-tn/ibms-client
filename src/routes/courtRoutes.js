import React from "react";
import { Outlet, Route } from "react-router-dom";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Dashboard from "components/court/Dashboard";
import ScrutinyDashboard from "components/court/scrutiny/Dashboard"
import DailyProceedings from "components/court/proceeding/DailyProceedings"
import CaseRegistration from "components/court/registration/CaseRegistration"
import PendingList from 'components/court/scrutiny/PendingList'
import DailyProceedingsList from 'components/court/proceeding/DailyProceedingsList'
import RegistrationPendingList from 'components/court/registration/RegistrationPendingList'
import SuretyPendingList from 'components/court/surety/SuretyPendingList'
import SuretyVerify from 'components/court/surety/SuretyVerify'
import JudgeForm from 'components/court/admin/judge/JudgeForm';
import JudgePeriodForm from 'components/court/admin/judge/JudgePeriodForm';
import JudgeList from 'components/court/admin/judge/JudgeList';
import PostCauseList from "components/court/PostCauseList";
import PublishCasueList from "components/court/PublishCauseList";
import CaseTransferRequest from "components/court/admin/CaseTransferRequest";
import CaseTransferReceive from "components/court/admin/CaseTransferReceive";
import GenerateOrder from "components/court/orders/GenerateOrder";
import UploadOrder from "components/court/orders/UploadOrder";
import BailBond from "components/court/orders/BailBond";

const courtRoutes = [
    { path: "dashboard", component: <Dashboard /> },
    { path: "case/scrutiny", component: <PendingList /> },
    { path: "case/scrutiny/detail", component: <ScrutinyDashboard /> },
    { path: "case/registration", component: <RegistrationPendingList /> },
    { path: "case/registration/detail", component: <CaseRegistration /> },
    { path: "case/cause-list/post", component: <PostCauseList /> },
    { path: "case/cause-list/publish", component: <PublishCasueList /> },
    { path: "case/proceeding", component: <DailyProceedingsList /> },
    { path: "case/proceeding/detail", component: <DailyProceedings />},
    { path: "case/order/odt", component: <BailBond />},
    { path: "case/order/generate", component: <GenerateOrder />},
    { path: "case/order/upload", component: <UploadOrder />},
    { path: "case/surety", component: <SuretyPendingList />},
    { path: "case/surety/verify", component: <SuretyVerify />},
    { path: "case/transfer/request", component: <CaseTransferRequest />},
    { path: "case/transfer/receive", component: <CaseTransferReceive />},
    { path: "admin/judge", component: <JudgeForm />},
    { path: "admin/judge/list", component: <JudgeList />},
    { path: "admin/judge/period", component: <JudgePeriodForm />}

];


const CourtLayout = () => (
    <PrivateRoute>
        {/* <div className="container-fluid" style={{ minHeight:'500px'}}>
            <div className="card" style={{ boxShadow:'none', border:'none'}}>
                <div className="card-body" style={{ boxShadow:'none', borderColor:'none'}}></div> */}
                <Outlet />
            {/* </div>
        </div> */}
    </PrivateRoute>
);

export const CourtRoutes = () => (
    <Route path="court" element={<CourtLayout />}>
        {courtRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);
