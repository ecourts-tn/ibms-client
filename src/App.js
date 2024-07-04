import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./components/pages/Dashboard"
import Login from "./components/layout/Login"
import Register from "./components/layout/Register"
import PublicLayout from "./components/layout/PublicLayout"
import BailFiling from "./components/filing/BailFiling"
import IntervenePetition from "./components/IntervenePetition/SearchBail"
import CaseStatus from "./components/kiosk/CaseStatus"
import DraftList from "./components/pages/DraftList"
import Payment from "./components/pages/Payment"
import PetitionList from "./components/pages/PetitionList"
import PetitionDetail from "./components/pages/PetitionDetail"
import PdfGenerator from "./components/pages/PdfGenerator"
import SideBar from './components/layout/SideBar'
import MuiStepper from './components/MuiStepper'
import Surety from './components/Surety'


function App() {
  
 return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            <Route index element={<Login />} />
            <Route path="pdf" element={<PdfGenerator />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="petition/draft" element={<DraftList />} />
            <Route path="petition/list" element={<PetitionList />} />
            <Route path="petition/detail" element={<PetitionDetail />} />
            <Route path="petition/pdf" element={<PdfGenerator />} />
            <Route path="petition/payment" element={<Payment />} />
            <Route path="user/registration" element={<Register />} />
            <Route path="petition/new-filing" element={<BailFiling />} />
            <Route path="petition/intervene-petition" element={<IntervenePetition />} />
            <Route path="filing/kiosk" element={<CaseStatus />} />
            <Route path="filing" element={<SideBar />} />
            <Route path="stepper" element={<MuiStepper />} />
            <Route path="surety" element={<Surety />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
    
  )
}



export default App