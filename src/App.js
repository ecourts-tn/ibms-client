import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect } from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom"
/* -------Layout & Providers ----------*/
import PublicLayout from 'components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import { AuthProvider } from "contexts/AuthContext";
import { AppProvider } from 'contexts/AppContext';
/* -------Authentication -----------*/
import { publicRoutes } from 'routes/publicRoutes';
import { ABailFilingRoutes, filingRoutes } from 'routes/filingRoutes';
import { CourtRoutes, courtRoutes } from 'routes/courtRoutes';
import { policeRoutes } from 'routes/policeRoutes';
import { prosecutorRoutes } from 'routes/prosecutorRoutes';
import { prisonRoutes } from 'routes/prisonRoutes';
import { BailFilingRoutes } from 'routes/filingRoutes';
import { ConditionFilingRoutes } from 'routes/conditionRoutes';
import { InterveneRoutes } from 'routes/interveneRoute';
import { ModificationFilingRoutes } from 'routes/modificationRoutes';
import { SuretyRoutes } from 'routes/suretyRoutes';
import { DischargeRoutes } from 'routes/dischargeRoutes';
import { ExtensionRoutes } from 'routes/extensionRoutes';
import NotFound from 'components/layout/public/NotFound';
import VerifyOrder from 'components/VerifyOrder';
import DepartmentRegistration from 'components/auth/DepartmentRegistration';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route element={<PublicLayout/>}>
              
                {publicRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                {filingRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                { BailFilingRoutes() }
                { ABailFilingRoutes() }
                { ConditionFilingRoutes() }
                { InterveneRoutes () }
                { ModificationFilingRoutes()}
                { SuretyRoutes() }
                { DischargeRoutes()}
                { ExtensionRoutes()}
              </Route> 
              <Route element={<AdminLayout />}>
                  { CourtRoutes() }
                <Route path="police">
                  { policeRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                </Route>
                <Route path="prison">
                { prisonRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                </Route>
                <Route path="prosecution">
                { prosecutorRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                </Route>
              </Route>
              <Route path='registration' element={<DepartmentRegistration/>}>

              </Route>
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter> 

    </>
    
  )
}



export default App