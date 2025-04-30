import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Dashboard from "components/police/Dashboard"
import ResponsePending from "components/police/ResponsePending"
import ResponseCreate from 'components/police/ResponseCreate'
import ResponseSubmitted from "components/police/ResponseSubmitted"
import ResponseDetails from 'components/police/ResponseDetails'
import ConditionList from 'components/police/ConditionList'
import ConditionForm from 'components/police/ConditionForm'
import PetitionFiling from 'components/police/PetitionFiling'
import PoliceProfile from 'components/police/Profile'
import ListedCases from "components/court/ListedCases";


export const policeRoutes = [
    {   path: "dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }, 
    {   path:"response/pending",
        element:(
            <PrivateRoute>
                <ResponsePending />
            </PrivateRoute>
        )
    },
    {   path:"response/submitted",
        element:(
            <PrivateRoute>
                <ResponseSubmitted />
            </PrivateRoute>
        )
    },
    {   path:"response/create",
        element:(
            <PrivateRoute>
                <ResponseCreate />
            </PrivateRoute>
        )
    },
    {   path:"response/detail",
        element:(
            <PrivateRoute>
                <ResponseDetails />
            </PrivateRoute>
        )
    },
    {   path:"condition",
        element:(
            <PrivateRoute>
                <ConditionForm />
            </PrivateRoute>
        )
    },
    {   path:"condition/create",
        element:(
            <PrivateRoute>
                <ConditionForm />
            </PrivateRoute>
        )
    },
    {   path:"filing/petition",
        element:(
            <PrivateRoute>
                <PetitionFiling />
            </PrivateRoute>
        )
    },
    {   path:"profile",
        element:(
            <PrivateRoute>
                <PoliceProfile />
            </PrivateRoute>
        )
    },
    {   path:"listed",
        element:(
            <PrivateRoute>
                <ListedCases />
            </PrivateRoute>
        )
    },
]
