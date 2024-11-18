import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Dashboard from "components/prison/Dashboard"
import PrisonResponsePending from "components/prison/ResponsePending"
import PrisonResponseSubmitted from "components/prison/ResponseSubmitted"
import PrisonResponseCreate from "components/prison/ResponseCreate"


export const prisonRoutes = [
    {   path: "dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }, 
    {   path:"jail-remark/pending",
        element:(
            <PrivateRoute>
                <PrisonResponsePending />
            </PrivateRoute>
        )
    },
    {   path:"jail-remark/submitted",
        element:(
            <PrivateRoute>
                <PrisonResponseSubmitted />
            </PrivateRoute>
        )
    },
    {   path:"jail-remark",
        element:(
            <PrivateRoute>
                <PrisonResponseCreate />
            </PrivateRoute>
        )
    },
]
