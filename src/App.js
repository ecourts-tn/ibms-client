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
import { courtRoutes } from 'routes/courtRoutes';
import { policeRoutes } from 'routes/policeRoutes';
import { prosecutorRoutes } from 'routes/prosecutorRoutes';
import { prisonRoutes } from 'routes/prisonRoutes';
import { BailFilingRoutes } from 'routes/filingRoutes';

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
              </Route>
              
              <Route element={<AdminLayout />}>
                <Route path="court">
                { courtRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                </Route>
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
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter> 

    </>
    
  )
}



export default App