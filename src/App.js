import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
/* -------Layout & Providers ----------*/
import PublicLayout from 'components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import { AuthProvider } from "contexts/AuthContext";
import { AppProvider } from 'contexts/AppContext';
/* -------Authentication -----------*/
import { publicRoutes } from 'routes/publicRoutes';
<<<<<<< HEAD
import { ABailFilingRoutes } from 'routes/abilRoutes';
=======
import { filingRoutes } from 'routes/filingRoutes';
>>>>>>> c978c7ed4b47e6ab70c2c25e24a525bdf3c861e7
import { CourtRoutes } from 'routes/courtRoutes';
import { policeRoutes } from 'routes/policeRoutes';
import { prosecutorRoutes } from 'routes/prosecutorRoutes';
import { prisonRoutes } from 'routes/prisonRoutes';
import { BailFilingRoutes } from 'routes/bailRoutes';
<<<<<<< HEAD
=======
import { ABailFilingRoutes } from 'routes/abilRoutes';
>>>>>>> c978c7ed4b47e6ab70c2c25e24a525bdf3c861e7
import { ConditionFilingRoutes } from 'routes/conditionRoutes';
import { InterveneRoutes } from 'routes/interveneRoute';
import { ModificationFilingRoutes } from 'routes/modificationRoutes';
import { SuretyRoutes } from 'routes/suretyRoutes';
import { DischargeRoutes } from 'routes/dischargeRoutes';
import { ExtensionRoutes } from 'routes/extensionRoutes';
import { ReturnPassportRoutes } from 'routes/passportRoutes';
import { ReturnPropertyRoutes } from 'routes/propertyRoutes';
import DepartmentRegistration from 'components/auth/DepartmentRegistration';
import { filingRoutes } from 'routes/filingRoutes';

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
                { ReturnPassportRoutes()}
                { ReturnPropertyRoutes() }
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