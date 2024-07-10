import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./components/pages/Dashboard"
import Login from "./components/layout/Login"
import Register from "./components/layout/Register"
import PublicLayout from "./components/layout/PublicLayout"
import BailFiling from "./components/filing/BailFiling"
import IntervenePetition from "./components/IntervenePetition/NewPetition"
import CaseStatus from "./components/kiosk/CaseStatus"
import DraftList from "./components/pages/DraftList"
import Payment from "./components/pages/Payment"
import PetitionList from "./components/pages/PetitionList"
import PetitionDetail from "./components/pages/PetitionDetail"
import PdfGenerator from "./components/pages/PdfGenerator"
import SideBar from './components/layout/SideBar'
import MuiStepper from './components/MuiStepper'
import Surety from './components/Surety'
import NotFound from './components/pages/NotFound'

import { PrivateRoute } from "./hooks/PrivateRoute";
import { AuthProvider } from "./hooks/useAuth";


function App() {

  const isAuthenticated = false
  
 return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route index element={<Login />} />
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
                path="petition/filing" 
                element={
                  <PrivateRoute>
                    <BailFiling />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="petition/intervene/filing" 
                element={
                  <PrivateRoute>
                    <IntervenePetition />
                  </PrivateRoute>
                }
              />
              <Route 
                path="petition/surety/filing" 
                element={
                <PrivateRoute>
                  <Surety />
                </PrivateRoute>
                }
              />
              <Route path="user/registration" element={<Register />} />
              <Route path="filing/kiosk" element={<CaseStatus />} />
              {/* <Route path="filing" element={<SideBar />} /> */}
              <Route path="stepper" element={<MuiStepper />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
    
  )
}



export default App