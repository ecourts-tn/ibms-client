import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Dashboard from "components/prosecutor/Dashboard"
import ProsecutionResponsePending from "components/prosecutor/ResponsePending"
import ProsecutionResponseSubmitted from "components/prosecutor/ResponseSubmitted"
import ProsecutionResponse from "components/prosecutor/ResponseCreate"


export const prosecutorRoutes = [
    {   path: "dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }, 
    {   path:"remark/pending",
        element:(
            <PrivateRoute>
                <ProsecutionResponsePending />
            </PrivateRoute>
        )
    },
    {   path:"remark/submitted",
        element:(
            <PrivateRoute>
                <ProsecutionResponseSubmitted />
            </PrivateRoute>
        )
    },
    {   path:"remark/create",
        element:(
            <PrivateRoute>
                <ProsecutionResponse />
            </PrivateRoute>
        )
    }
]