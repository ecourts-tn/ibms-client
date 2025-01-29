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
import ResetPasswordConfirm from "components/auth/ResetPasswordConfirm";


export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "auth/registration", element:<AdvocateRegistration />},
    { path: "auth/reset-password", element: <ResetPassword /> },
    { path: "auth/reset-password/confirmation/:uid/:token", element: <ResetPasswordConfirm /> },
    { path: "status/filing-number", element:<FilingSearch/>},
    { path: "status/registration-number", element:<RegistrationSearch />},
    { path: "status/cnr-number", element:<CNRSearch />},
    { path: "status/fir-number", element:<FIRSearch />},
    { path: "user-guide", element:<Home />},
    { path: "verify-order", element:<VerifyOrder />},
    { path: "*", element:<NotFound />}
]

