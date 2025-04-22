import React from "react";
/* -------- Components ----------- */
import Home from 'components/Home'
import CNRSearch from 'components/kiosk/CNRSearch'
import FIRSearch from 'components/kiosk/FIRSearch'
import FilingSearch from "components/kiosk/FilingSearch";
import RegistrationSearch from 'components/kiosk/RegistrationSearch'
import AdvocateRegistration from "components/auth/AdvocateRegistration";
import VerifyOrder from "components/VerifyOrder";
import NotFound from "components/layout/public/NotFound";
import ResetPassword from "components/auth/ResetPassword";
import { PetitionDetail } from "components/filing";
import ResetPasswordConfirm from "components/auth/ResetPasswordConfirm";
import RegistrationNew from "components/auth/RegistraionNew";
import { Profile } from "components/auth";


export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "auth/registration", element:<RegistrationNew />},
    { path: "profile/", element:<Profile />},
    { path: "auth/reset-password", element: <ResetPassword /> },
    { path: "auth/reset-password/confirm/:uid/:token", element: <ResetPasswordConfirm /> },
    { path: "filing/detail", element: <PetitionDetail /> },
    { path: "status/filing-number", element:<FilingSearch/>},
    { path: "status/registration-number", element:<RegistrationSearch />},
    { path: "status/cnr-number", element:<CNRSearch />},
    { path: "status/fir-number", element:<FIRSearch />},
    { path: "user-guide", element:<Home />},
    { path: "verify-order", element:<VerifyOrder />},
    { path: "*", element:<NotFound />}
]

