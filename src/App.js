import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect } from 'react';
import { Routes, Route, HashRouter } from "react-router-dom"
import Dashboard from "./components/pages/Dashboard"
import Home from './components/pages/Home'
import Register from "./components/pages/Register"
import PublicLayout from './components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import BailFiling from "./components/filing/BailFiling"
import Relaxation from './components/petition/relaxation/Relaxation'
import IntervenePetition from "components/petition/intervene/NewPetition"
import Surety from './components/petition/surety/Surety'
import DischargeSurety from './components/petition/surety/DischargeSurety'
import Extension from './components/petition/extension/Extension'
import ReturnPassport from './components/petition/return/ReturnPassport'
import FilingSearch from './components/pages/kiosk/FilingSearch'
import CNRSearch from './components/pages/kiosk/CNRSearch'
import FIRSearch from './components/pages/kiosk/FIRSearch'
import RegistrationSearch from './components/pages/kiosk/RegistrationSearch'
import DraftList from "./components/pages/DraftList"
import Payment from "./components/pages/Payment"
import PetitionList from "./components/pages/PetitionList"
import PetitionDetail from "./components/pages/PetitionDetail"
import PdfGenerator from "./components/pages/PdfGenerator"

import { PrivateRoute } from "./hooks/PrivateRoute";
import { AuthProvider } from "./hooks/useAuth";
import Logout from './components/pages/Logout'
import ChangePassword from './components/pages/ChangePassword'
import Profile from './components/pages/Profile'

import Litigant from './components/petition/antibail/Litigant'

import ModificationNew from './components/petition/modification/ModificationNew'


import ABail from 'components/petition/antibail/ABail';
import ReturnProperty from 'components/petition/return/ReturnProperty';
import Pleadings from 'components/pages/Pleadings';
import { AppProvider } from 'contexts/AppContext';
import Bail from 'components/filing/Bail';

function App() {

  useEffect(() => {
    sessionStorage.setItem('language', 'ta')
  },[])
  
  return (
    <>
      <HashRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route element={<PublicLayout/>}>
                <Route path="/auth/login" element={<Home />} />
                <Route index element={<Home />} />
                <Route path="pdf" element={<PdfGenerator />} />
                <Route path="bail" element={<Bail />}/>
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/petition/draft"
                  element={
                    <PrivateRoute>
                      <DraftList />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="petition/list" element={
                  <PrivateRoute>
                    <PetitionList />
                  </PrivateRoute>
                } />
                <Route 
                  path="petition/detail" 
                  element={
                    <PrivateRoute>
                      <PetitionDetail />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/pdf" 
                  element={
                    <PrivateRoute>
                      <PdfGenerator />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/payment" 
                  element={
                    <PrivateRoute>
                      <Payment />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/bail" 
                  element={
                    <PrivateRoute>
                      <BailFiling />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/anticipatory/bail" 
                  element={
                    <PrivateRoute>
                      <ABail />
                    </PrivateRoute>       
                  } 
                />
                <Route 
                  path="petition/bail/litigant" 
                  element={
                    
                      <Litigant />
                    
                  } 
                />
                <Route 
                  path="petition/relaxation" 
                  element={
                    <PrivateRoute>
                      <Relaxation />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/intervene" 
                  element={
                    <PrivateRoute>
                      <IntervenePetition />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="petition/modification" 
                  element={
                    <PrivateRoute>
                      <ModificationNew />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="petition/surety" 
                  element={
                  <PrivateRoute>
                    <Surety />
                  </PrivateRoute>
                  }
                />
                <Route 
                  path="petition/surety-discharge" 
                  element={
                    <PrivateRoute>
                      <DischargeSurety />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/extension-time" 
                  element={
                    <PrivateRoute>
                      <Extension />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/return-passport" 
                  element={
                    <PrivateRoute>
                      <ReturnPassport />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="petition/return-property" 
                  element={
                    <PrivateRoute>
                      <ReturnProperty />
                    </PrivateRoute>
                  } 
                />
                <Route
                  path="pleadings"
                  element={
                    <PrivateRoute>
                      <Pleadings />
                    </PrivateRoute>
                  }
                ></Route>
                <Route
                  path="status/filing-number"
                  element={<FilingSearch />}
                />
                <Route
                  path="status/registration-number"
                  element={<RegistrationSearch />}
                />
                <Route
                  path="status/cnr-number"
                  element={<CNRSearch />}
                />
                <Route
                  path="status/fir-number"
                  element={<FIRSearch />}
                />
                <Route 
                  path="auth/change-password" 
                  element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="auth/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="logout" 
                  element={
                    <PrivateRoute>
                      <Logout />
                    </PrivateRoute>
                  } 
                />
                <Route path="user/registration" element={<Register />} />
              </Route>
            
            </Routes>
          </AppProvider>
        </AuthProvider>
      </HashRouter> 

    </>
    
  )
}



export default App