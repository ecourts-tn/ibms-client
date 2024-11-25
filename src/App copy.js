import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect } from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom"
/* -------Layout & Providers ----------*/
import PublicLayout from 'components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import { PrivateRoute } from "./hooks/PrivateRoute";
import { AuthProvider } from "contexts/AuthContext";
import { AppProvider } from 'contexts/AppContext';
/* -------Authentication -----------*/
import Logout from 'components/auth/Logout'
import Profile from 'components/auth/Profile'
import Register from "components/auth/AdvocateRegistration"
import Registration from "components/auth/DepartmentRegistration"
import ChangePassword from 'components/auth/ChangePassword'
import ResetPassword from 'components/auth/ResetPassword';
import Home from 'components/Home'
/* ----------- Filing --------------*/
import Dashboard from "components/filing/Dashboard"
import DraftList from "components/filing/DraftList"
import PetitionList from "components/filing/PetitionList"
import PetitionDetail from "components/filing/PetitionDetail"
import BailFiling from "components/filing/bail/BailFiling"
import Relaxation from 'components/filing/relaxation/RelaxationOld'
import IntervenePetition from "components/filing/intervene/NewPetition"
import Surety from 'components/filing/surety/Surety'
import DischargeSurety from 'components/filing/surety/DischargeSurety'
import Extension from 'components/filing/extension/Extension'
import ReturnPassport from 'components/filing/return/ReturnPassport'
import PdfGenerator from "components/filing/PdfGenerator"
import Litigant from 'components/filing/antibail/Litigant'
import Payment from "components/payment/Payment"
import ModificationNew from './components/filing/modification/ModificationNew'
import ABail from 'components/filing/antibail/ABail';
import ReturnProperty from 'components/filing/return/ReturnProperty';
import Pleadings from 'components/filing/Pleadings';
import Bail from 'components/filing/bail/Bail';
/* -------- Case Status -------------*/ 
import FilingSearch from 'components/kiosk/FilingSearch'
import CNRSearch from 'components/kiosk/CNRSearch'
import FIRSearch from 'components/kiosk/FIRSearch'
import RegistrationSearch from 'components/kiosk/RegistrationSearch'
/* ---------------- Court user components --------------------------*/ 
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
/* -------------- Police user components -------------------------------*/ 
import PoliceDashboard from "components/police/Dashboard"
import ResponsePending from "components/police/ResponsePending"
import ResponseCreate from './components/police/ResponseCreate'
import ResponseSubmitted from "components/police/ResponseSubmitted"
import ResponseDetails from 'components/police/ResponseDetails'
import ConditionList from 'components/police/ConditionList'
import ConditionForm from 'components/police/ConditionForm'
import BailCancellation from './components/police/BailCancellation'
import RequestCustody from './components/police/RequestCustody'
import PoliceProfile from 'components/police/Profile'
/* -------------------Prison user components ---------------------------------*/
import PrisonDashboard from "components/prison/Dashboard"
import PrisonResponsePending from "components/prison/ResponsePending"
import PrisonResponseSubmitted from "components/prison/ResponseSubmitted"
import PrisonResponseCreate from "components/prison/ResponseCreate"
/* --------------------PP/APP user components*/ 
import ProsecutorDashboard from "components/prosecutor/Dashboard"
import ProsecutionResponsePending from "components/prosecutor/ResponsePending"
import ProsecutionResponseSubmitted from "components/prosecutor/ResponseSubmitted"
import ProsecutionResponse from "components/prosecutor/ResponseCreate"

import { publicRoutes } from 'routes/publicRoutes';
import { filingRoutes } from 'routes/filingRoutes';

function App() {

  useEffect(() => {
    sessionStorage.setItem('language', 'ta')
  },[])
  
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
              <Route element={<AdminLayout />}>
                    <Route
                      path="/auth/user/registration"
                      element={
                        <PrivateRoute>
                          <Registration />
                        </PrivateRoute>
                      }
                    />
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
                        path="profile"
                        element={<PoliceProfile />}
                      />
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
                        path="response/submitted"  
                        element={
                          <PrivateRoute>
                            <ResponseSubmitted />
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
                      <Route 
                        path="response/details" 
                        element={
                          <PrivateRoute>
                            <ResponseDetails />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="condition" 
                        element={
                          <PrivateRoute>
                            <ConditionList />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="condition/create" 
                        element={
                          <PrivateRoute>
                            <ConditionForm />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="bail/cancellation" 
                        element={
                          <PrivateRoute>
                            <BailCancellation />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="request/custody" 
                        element={
                          <PrivateRoute>
                            <RequestCustody />
                          </PrivateRoute>
                        } 
                      />
                  </Route>
                  <Route path="prison">
                    <Route 
                      path="dashboard" 
                      element={
                        <PrivateRoute>
                          <PrisonDashboard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="response/pending" 
                      element={
                        <PrivateRoute>
                          <PrisonResponsePending />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="response/submitted" 
                      element={
                        <PrivateRoute>
                          <PrisonResponseSubmitted />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="response/create" 
                      element={
                        <PrivateRoute>
                          <PrisonResponseCreate />
                        </PrivateRoute>
                      } 
                    />
                  </Route>
                  <Route path="prosecution">
                  <Route 
                        path="dashboard" 
                        element={
                        <PrivateRoute>
                          <ProsecutorDashboard />
                        </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="response/pending/" 
                        element={
                          <PrivateRoute>
                            <ProsecutionResponsePending />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="response/submitted/" 
                        element={
                          <PrivateRoute>
                            <ProsecutionResponseSubmitted />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="response/create/" 
                        element={
                          <PrivateRoute>
                            <ProsecutionResponse />
                          </PrivateRoute>
                        } 
                      />
                  </Route>
                  <Route path="administration">
                    
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