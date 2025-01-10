import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
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
import Pleadings from "components/filing/Pleadings";
import ApprovedList from "components/filing/ApprovedList";
import ReturnedList from "components/filing/ReturnedList";
import ProceedingDetail from "components/filing/ProceedingDetail";

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