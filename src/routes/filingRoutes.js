import React from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
/* -------- Components ----------- */
import Logout from 'components/auth/Logout'
import Profile from 'components/auth/Profile'
import ChangePassword from 'components/auth/ChangePassword'
import ResetPassword from 'components/auth/ResetPassword';
import Dashboard from "components/filing/Dashboard"
import DraftList from "components/filing/DraftList"
import PetitionList from "components/filing/PetitionList"
import PetitionDetail from "components/filing/PetitionDetail"
import BailFiling from "components/filing/bail/BailFiling"
import Relaxation from 'components/filing/relaxation/Relaxation'
import IntervenePetition from "components/filing/intervene/NewPetition"
import Surety from 'components/filing/surety/Surety'
import DischargeSurety from 'components/filing/surety/DischargeSurety'
import Extension from 'components/filing/extension/Extension'
import ReturnPassport from 'components/filing/return/ReturnPassport'
import PdfGenerator from "components/filing/PdfGenerator"
import ModificationNew from 'components/filing/modification/ModificationNew'
import ABail from 'components/filing/antibail/ABail';
import ReturnProperty from 'components/filing/return/ReturnProperty';

export const filingRoutes = [
    {   path: "filing/dashboard", 
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }, 
    {   path:"filing/bail",
        element:(
            <PrivateRoute>
                <BailFiling />
            </PrivateRoute>
        )
    },
    {
        path:"filing/anticipatory/bail",
        element: (
            <PrivateRoute>
                <ABail />
            </PrivateRoute>
        )
    },
    { 
        path:"filing/condition-relaxation",
        element:(
            <PrivateRoute>
                <Relaxation />
            </PrivateRoute>
        )
    },
    {
        path:"filing/modification-petition",
        element:(
            <PrivateRoute>
                <ModificationNew />
            </PrivateRoute>
        )
    },
    {   path:"filing/intervene-petition",
        element:(
            <PrivateRoute>
                <IntervenePetition />
            </PrivateRoute>
        )
    },
    {
        path:"filing/surety-petition",
        element:(
            <PrivateRoute>
                <Surety />
            </PrivateRoute>
        )
    },
    {
        path:"filing/surety/discharge",
        element:(
            <PrivateRoute>
                <DischargeSurety />
            </PrivateRoute>
        )
    },
    {
        path:"filing/extension-time",
        element:(
            <PrivateRoute>
                <Extension></Extension>
            </PrivateRoute>
        )
    },
    {
        path:"filing/return-passport",
        element:(
            <PrivateRoute>
                <ReturnPassport/>
            </PrivateRoute>
        )
    },
    {
        path:"filing/return-property",
        element:(
            <PrivateRoute>
                <ReturnProperty />
            </PrivateRoute>
        )
    },
    {
        path:"pleading",
        element:(
            <PrivateRoute>
                <ReturnProperty/>
            </PrivateRoute>
        )
    },
    {
        path:"filing/draft-list",
        element:(
            <PrivateRoute>
                <DraftList />
            </PrivateRoute>
        )
    },{
        path:"filing/submitted-list",
        element:(
            <PrivateRoute>
                <PetitionList />
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
        element:(
            <PrivateRoute>
                <ResetPassword />
            </PrivateRoute>
        )
    }

]