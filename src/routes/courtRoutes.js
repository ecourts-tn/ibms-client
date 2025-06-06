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
import DepartmentRegistration from "components/auth/DepartmentRegistration";
import AllocationPendingList from "components/court/allocation/AllocationPendingList";
import CaseAllocation from "components/court/allocation/CaseAllocation";
import ModifyBusiness from "components/court/proceeding/ModifyBusiness";
import JudgePeriodList from "components/court/admin/judge/JudgePeriodList";
import BenchList from "components/court/admin/judge/BenchList";
import BenchForm from "components/court/admin/judge/BenchForm";
import ProsecutorPeriod from "components/court/admin/judge/ProsecutorPeriod";
import ProsecutorForm from "components/court/admin/judge/ProsecutorForm";
import PetitionList from "components/court/PetitionList";
import ApprovedList from "components/court/ApprovedList";
import ReturnedList from "components/court/ReturnedList";
import RejectedList from "components/court/RejectedList";
import ListedCases from "components/court/ListedCases";
import ConditionComplaince from "components/court/ConditionComplaince";
import UserList from "components/auth/UserList";

const courtRoutes = [
    { path: "dashboard", component: <Dashboard /> },
    { path: "petition", component: <PetitionList />},
    { path: "approved", component: <ApprovedList />},
    { path: "returned", component: <ReturnedList />},
    { path: "rejected", component: <RejectedList />},
    { path: "listed", component: <ListedCases />},
    { path: "case/scrutiny", component: <PendingList /> },
    { path: "case/scrutiny/detail", component: <ScrutinyDashboard /> },
    { path: "case/registration", component: <RegistrationPendingList /> },
    { path: "case/registration/detail", component: <CaseRegistration /> },
    { path: "case/allocation", component: <AllocationPendingList />},
    { path: "case/allocation/detail", component: <CaseAllocation />},
    { path: "case/cause-list/post", component: <PostCauseList /> },
    { path: "case/cause-list/publish", component: <PublishCasueList /> },
    { path: "case/proceeding", component: <DailyProceedingsList /> },
    { path: "case/proceeding/detail", component: <DailyProceedings />},
    { path: "case/proceeding/modify", component: <ModifyBusiness />},
    { path: "case/condition/", component: <ConditionComplaince /> },
    { path: "case/bailbond/generate", component: <BailBond />},
    { path: "case/order/generate", component: <GenerateOrder />},
    { path: "case/order/upload", component: <UploadOrder />},
    { path: "case/surety/pendinglist", component: <SuretyPendingList />},
    { path: "case/surety/verify", component: <SuretyVerify />},
    { path: "case/transfer/request", component: <CaseTransferRequest />},
    { path: "case/transfer/receive", component: <CaseTransferReceive />},
    { path: "admin/judge", component: <JudgeForm />},
    { path: "admin/judge/list", component: <JudgeList />},
    { path: "admin/judge/period", component: <JudgePeriodForm />},
    { path: "admin/judge/period/list", component: <JudgePeriodList />},
    { path: "admin/bench/list", component: <BenchList />},
    { path: "admin/bench", component: <BenchForm />},
    { path: "admin/prosecutor/list", component: <ProsecutorPeriod />},
    { path: "admin/prosecutor/", component: <ProsecutorForm />},
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
