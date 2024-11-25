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


export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "auth/registration", element:<AdvocateRegistration />},
    { path: "status/filing-number", element:<FilingSearch/>},
    { path: "status/registration-number", element:<RegistrationSearch />},
    { path: "status/cnr-number", element:<CNRSearch />},
    { path: "status/fir-number", element:<FIRSearch />},
    { path: "user-guide", element:<Home />},
    { path: "verify-order", element:<VerifyOrder />},
    { path: "*", element:<NotFound />}
]

