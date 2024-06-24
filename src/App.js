import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import Filing from "./components/filing/Filing"
import Response from "./components/response/Response"
import ResponseCreate from "./components/response/ResponseCreate"
import Login from "./layout/public/Login"
import Register from "./layout/public/Register"
import PublicLayout from "./layout/PublicLayout"
import AdminLayout from "./layout/AdminLayout"
import BailFiling from "./components/filing/BailFiling"
import TodayCases from "./components/court/TodayCases"
import DailyProceedings from "./components/court/DailyProceedings"
import IntervenePetition from "./components/IntervenePetition/Petition"
import CaseScrutiny from "./components/court/CaseScrutiny"
import CaseRegistration from "./components/court/CaseRegistration"
import 'bootstrap/dist/css/bootstrap.min.css'
import CaseStatus from "./components/kiosk/CaseStatus"
import DraftList from "./pages/DraftList"
import Payment from "./pages/Payment"
import PetitionList from "./pages/PetitionList"
import PetitionDetail from "./pages/PetitionDetail"
import PdfGenerator from "./components/PdfGenerator"

// const appendScript = (scriptToAppend) => {
//   const script = document.createElement("script");
//   script.src = scriptToAppend;
//   script.async = true;
//   document.body.appendChild(script);
// }




function App() {
  
  // useEffect(() => {
  //   appendScript(`${process.env.PUBLIC_URL}/plugins/select2/js/select2.full.min.js`);
  // })
  // const dispatch = useDispatch()
  // const stateStatus = useSelector(getStatesStatus)
  // const districtStatus = useSelector(getDistrictsStatus)
  // const establishmentStatus = useSelector(getEstablishmentsStatus)
  // const courtStatus = useSelector(getCourtsStatus)
  // const talukStatus = useSelector(getTaluksStatus)
  // const prisonStatus = useSelector(getPrisonsStatus)

  // const courtTypeStatus = useSelector(getCourtTypeStatus)
  // const benchTypeStatus = useSelector(getBenchTypeStatus)
  // const caseTypeStatus = useSelector(getCaseTypeStatus)
  // const bailTypeStatus = useSelector(getBailTypeStatus)
  // const complaintTypeStatus = useSelector(getComplaintTypeStatus)


  // useEffect(() => {
  //   if(courtTypeStatus === 'idle'){
  //     dispatch(getCourtTypes())
  //   }
  // },[courtTypeStatus, dispatch])

  // useEffect(() => {
  //   if(benchTypeStatus === 'idle'){
  //     dispatch(getBenchTypes())
  //   }
  // }, [benchTypeStatus, dispatch])

  // useEffect(() => {
  //   if(caseTypeStatus === 'idle'){
  //     dispatch(getCaseTypes())
  //   }
  // }, [caseTypeStatus, dispatch])

  // useEffect(() => {
  //   if(bailTypeStatus === 'idle'){
  //     dispatch(getBailTypes())
  //   }
  // }, [bailTypeStatus, dispatch])

  // useEffect(() => {
  //   if(complaintTypeStatus === 'idle'){
  //     dispatch(getComplaintTypes())
  //   }
  // }, [complaintTypeStatus, dispatch])

  // useEffect(() => {
  //   if(stateStatus === 'idle'){
  //     dispatch(getStates())
  //   }
  // }, [stateStatus, dispatch])

  // useEffect(() => {
  //   if(districtStatus === 'idle'){
  //     dispatch(getDistricts())
  //   }
  // },[districtStatus, dispatch])

  // useEffect(() => {
  //   if(establishmentStatus === 'idle'){
  //     dispatch(getEstablishments())
  //   }
  // }, [establishmentStatus, dispatch])

  // useEffect(() => {
  //   if(courtStatus === 'idle'){
  //     dispatch(getCourts())
  //   }
  // }, [courtStatus, dispatch])

  // useEffect(() => {
  //   if(talukStatus === 'idle'){
  //     dispatch(getTaluks())
  //   }
  // }, [talukStatus, dispatch])

  // useEffect(() => {
  //   if(prisonStatus === 'idle'){
  //     dispatch(getPrisons())
  //   }
  // },[prisonStatus, dispatch])

  return (
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
          <Route path="filing/intervene-petition" element={<IntervenePetition />} />
          <Route path="filing/kiosk" element={<CaseStatus />} />
        </Route>
        <Route element={<AdminLayout />} >
          <Route path="filing" element={<Filing />} />
          <Route path="filing/intervene-petition" element={<IntervenePetition />} />
          <Route path="police/response" element={<Response />} />
          <Route path="police/response/create" element={<ResponseCreate />} />
          <Route path="court" >
            <Route path="today-cases" element={<TodayCases />} />
            <Route path="daily-proceedings" element={<DailyProceedings />} />
            <Route path="case-scrutiny" element={<CaseScrutiny />} />
            <Route path="case-registration" element={<CaseRegistration />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}



export default App