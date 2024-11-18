import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Dashboard from "components/court/Dashboard";
import ScrutinyDashboard from "components/court/scrutiny/Dashboard"
import TodayCases from 'components/court/TodayCases';
import DailyProceedings from "components/court/DailyProceedings"
import CaseRegistration from "components/court/CaseRegistration"
import PendingList from 'components/court/scrutiny/PendingList'
import DailyProceedingsList from 'components/court/DailyProceedingsList'
import BailOrder from 'components/court/BailOrder'
import RegistrationPendingList from 'components/court/RegistrationPendingList'
import CauseList from 'components/court/CauseList'
import SuretyPendingList from 'components/court/SuretyPendingList'
import SuretyVerify from 'components/court/SuretyVerify'
import OrderPendingList from 'components/court/OrderPendingList'
import JudgeForm from 'components/court/judge/JudgeForm';
import JudgePeriodForm from 'components/court/judge/JudgePeriodForm';
import JudgeList from 'components/court/judge/JudgeList';

export const courtRoutes = [
    {   path: "dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }, 
    {   path:"cases/listed-today",
        element:(
            <PrivateRoute>
                <TodayCases />
            </PrivateRoute>
        )
    },
    {
        path:"case/scrutiny",
        element:(
            <PrivateRoute>
                <PendingList />
            </PrivateRoute>
        )
    },
    {
        path:"case/scrutiny/detail",
        element:(
            <PrivateRoute>
                <ScrutinyDashboard />
            </PrivateRoute>
        )
    },
    {
        path:"case/registration",
        element:(
            <PrivateRoute>
                <RegistrationPendingList />
            </PrivateRoute>
        )
    },
    {
        path:"case/registration/detail",
        element:(
            <PrivateRoute>
                <CaseRegistration />
            </PrivateRoute>
        )
    },
    {
        path:"case/proceeding",
        element:(
            <PrivateRoute>
                <DailyProceedingsList />
            </PrivateRoute>
        )
    }, 
    {
        path:"case/proceeding/detail",
        element:(
            <PrivateRoute>
                <DailyProceedings />
            </PrivateRoute>
        )
    },
    {
        path:"case/cause-list",
        element:(
            <PrivateRoute>
                <CauseList />
            </PrivateRoute>
        )
    },
    {
        path:"case/order",
        element:(
            <PrivateRoute>
                <OrderPendingList />
            </PrivateRoute>
        )
    },
    {
        path:"case/order/generate",
        element:(
            <PrivateRoute>
                <BailOrder />
            </PrivateRoute>
        )
    },
    {
        path:"surety/",
        element:(
            <PrivateRoute>
                <SuretyPendingList />
            </PrivateRoute>
        )
    },
    {
        path:"surety/verify",
        element:(
            <PrivateRoute>
                <SuretyVerify />
            </PrivateRoute>
        )
    },
    {
        path:"admin/judge",
        element:(
            <PrivateRoute>
                <JudgeForm />
            </PrivateRoute>
        )
    },
    {
        path:"admin/judge/list/",
        element:(
            <PrivateRoute>
                <JudgeList />
            </PrivateRoute>
        )
    },
    {
        path:"admin/judge-period",
        element:(
            <PrivateRoute>
                <JudgePeriodForm />
            </PrivateRoute>
        )
    }
]
