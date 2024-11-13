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
import { AuthProvider } from "contexts/AuthContext";
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

import CourtDashboard from 'components/court/Dashboard'
import ScrutinyDashboard from "./components/court/scrutiny/Dashboard"
import TodayCases from 'components/court/TodayCases';
import DailyProceedings from "components/court/DailyProceedings"
import CaseRegistration from "components/court/CaseRegistration"
import PendingList from './components/court/scrutiny/PendingList'
import DailyProceedingsList from './components/court/DailyProceedingsList'
import BailOrder from './components/court/BailOrder'
import RegistrationPendingList from './components/court/RegistrationPendingList'
import CauseList from './components/court/CauseList'
import SuretyPendingList from './components/court/SuretyPendingList'
import SuretyVerify from './components/court/SuretyVerify'
import OrderPendingList from './components/court/OrderPendingList'
import JudgeForm from 'components/court/judge/JudgeForm';
import JudgePeriodForm from 'components/court/judge/JudgePeriodForm';
import JudgeList from 'components/court/judge/JudgeList';

import PoliceDashboard from 'components/police/Dashboard'
import ResponsePending from 'components/police/ResponsePending';
import ResponseCreate from 'components/police/ResponseCreate';

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
                <Route path="auth/login" element={<Home />} />
                <Route index element={<Home />} />
                <Route path="pdf" element={<PdfGenerator />} />
                <Route path="bail" element={<Bail />}/>
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="petition/draft"
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
              <Route path="/ibms" element={<AdminLayout />}>
                  <Route path="court">
                    <Route path="dashboard" element={<CourtDashboard />}></Route>
                    <Route 
                      path="petition/listed-today" 
                      element={
                        <PrivateRoute>
                          <TodayCases />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/proceedings" 
                      element={
                        <PrivateRoute>
                          <DailyProceedingsList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/case/proceedings" 
                      element={
                        <PrivateRoute>
                          <DailyProceedings />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/cause-list" 
                      element={
                        <PrivateRoute>
                          <CauseList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/scrutiny" 
                      element={
                        <PrivateRoute>
                          <PendingList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/scrutiny/details" 
                      element={
                        <PrivateRoute>
                          <ScrutinyDashboard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/registration/list" 
                      element={
                        <PrivateRoute>
                          <RegistrationPendingList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="petition/registration" 
                      element={
                        <PrivateRoute>
                          <CaseRegistration />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="surety/pending/list/" 
                      element={
                        <PrivateRoute>
                          <SuretyPendingList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="surety/verify/" 
                      element={
                        <PrivateRoute>
                          <SuretyVerify />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="orders/generate/" 
                      element={
                        <PrivateRoute>
                          <OrderPendingList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="bail/generate/order" 
                      element={
                        <PrivateRoute>
                          <BailOrder />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="orders/bail/" 
                      element={
                        <PrivateRoute>
                          <BailOrder />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="admin/judge" 
                      element={
                        <PrivateRoute>
                          <JudgeForm />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="admin/judge/list" 
                      element={
                        <PrivateRoute>
                          <JudgeList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="admin/judge-period" 
                      element={
                        <PrivateRoute>
                          <JudgePeriodForm />
                        </PrivateRoute>
                      } 
                    />
                  </Route>
                  <Route path="police">
                    <Route
                      path="dashboard"
                      element={
                        <PrivateRoute>
                          <PoliceDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="response/pending"
                      element={
                        <PrivateRoute>
                         <ResponsePending />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="response/create"
                      element={
                        <PrivateRoute>
                          <ResponseCreate />
                        </PrivateRoute>
                      }
                    />
                  </Route>
                  <Route path="prison">

                  </Route>
                  <Route path="prosecution">

                  </Route>
                  <Route path="administration">
                    
                  </Route>
              </Route>
            </Routes>
          </AppProvider>
        </AuthProvider>
      </HashRouter> 

    </>
    
  )
}



export default App