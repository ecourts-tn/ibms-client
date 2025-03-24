import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
/* -------Layout & Providers ----------*/
import PublicLayout from 'components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import { AuthProvider } from "contexts/AuthContext";
import { AppProvider } from 'contexts/AppContext';
import { publicRoutes } from 'routes/publicRoutes';
<<<<<<< HEAD
import { filingRoutes } from 'routes/filingRoutes';
=======
>>>>>>> deena
import { CourtRoutes } from 'routes/courtRoutes';
import { policeRoutes } from 'routes/policeRoutes';
import { prosecutorRoutes } from 'routes/prosecutorRoutes';
import { prisonRoutes } from 'routes/prisonRoutes';
<<<<<<< HEAD
import { BailFilingRoutes } from 'routes/bailRoutes';
import { ABailFilingRoutes } from 'routes/abilRoutes';
import { ConditionFilingRoutes } from 'routes/conditionRoutes';
import { InterveneRoutes } from 'routes/interveneRoute';
import { ModificationFilingRoutes } from 'routes/modificationRoutes';
import { SuretyRoutes } from 'routes/suretyRoutes';
import { DischargeRoutes } from 'routes/dischargeRoutes';
import { ExtensionRoutes } from 'routes/extensionRoutes';
import { ReturnPassportRoutes } from 'routes/passportRoutes';
import { ReturnPropertyRoutes } from 'routes/propertyRoutes';
import DepartmentRegistration from 'components/auth/DepartmentRegistration';

=======
import { FilingRoutes } from 'routes/filingRoutes';
import DepartmentRegistration from 'components/auth/DepartmentRegistration';
>>>>>>> deena

function App() {

  const handleRightClick = (event) => {
    event.preventDefault();  // Prevent the context menu from appearing
    alert('Right-click is disabled on this page!');
  };
  
  return (
    <>  
    {/* <div onContextMenu={handleRightClick}> */}
      <BrowserRouter basename="/ibms">
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route element={<PublicLayout/>}>
              
                {publicRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                { FilingRoutes()}
              </Route> 
              <Route element={<AdminLayout />}>
              <Route path='/auth/user/registration' element={<DepartmentRegistration/>} />
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
      {/* </div> */}

    </>
    
  )
}



export default App