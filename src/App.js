import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom"
import Dashboard from "./components/pages/Dashboard"
import Home from './components/pages/Home'
import Register from "./components/pages/Register"
import PublicLayout from "./components/pages/PublicLayout"
import BailFiling from "./components/filing/BailFiling"
import Relaxation from './components/petition/relaxation/Relaxation'
import IntervenePetition from "./components/petition/intervene/NewPetition"
import Modification from './components/petition/modification/Modification'
import Surety from './components/petition/surety/Surety'
import DischargeSurety from './components/petition/surety/DischargeSurety'
import Extension from './components/petition/extension/Extension'
import ReturnPassport from './components/petition/return/ReturnPassport'
import FilingSearch from './components/pages/kiosk/FilingSearch'
import CNRSearch from './components/pages/kiosk/CNRSearch'
import FIRSearch from './components/pages/kiosk/FIRSearch'
import RegistrationSearch from './components/pages/kiosk/RegistrationSearch'
import PartyNameSearch from './components/pages/kiosk/PartyNameSearch'
import CaseStatus from "./components/pages/kiosk/CaseStatus"
import DraftList from "./components/pages/DraftList"
import Payment from "./components/pages/Payment"
import PetitionList from "./components/pages/PetitionList"
import PetitionDetail from "./components/pages/PetitionDetail"
import PdfGenerator from "./components/pages/PdfGenerator"
import MultiStepForm from './components/petition/bail/MultiStepForm'
import NotFound from './components/pages/NotFound'

import { PrivateRoute } from "./hooks/PrivateRoute";
import { AuthProvider } from "./hooks/useAuth";
import Logout from './components/pages/Logout'
import DecryptForm from './components/DecryptForm'
import ChangePassword from './components/pages/ChangePassword'
import Profile from './components/pages/Profile'
import InitialInput from './components/petition/bail/InitialInput'
import Litigant from './components/petition/bail/Litigant'

import config from './config'

function App() {

  const isAuthenticated = false
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Feature Flag: ${config.featureFlag ? 'Enabled' : 'Disabled'}`);
 return (
    <>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/auth/login" element={<Home />} />
              <Route index element={<Home />} />
              <Route path="pdf" element={<PdfGenerator />} />
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
                path="petition/bail/initial-input" 
                element={
                  <PrivateRoute>
                    <InitialInput />
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
                    <Modification />
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
                path="status/party-name"
                element={<PartyNameSearch />}
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
              <Route path="filing/kiosk" element={<CaseStatus />} />
              <Route path="stepper" element={<MultiStepForm />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="decrypt" element={<DecryptForm />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </>
    
  )
}



export default App