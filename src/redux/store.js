import { configureStore } from '@reduxjs/toolkit'
import StateSlice from '../redux/features/StateSlice'
import DistrictSlice from '../redux/features/DistrictSlice'
import TalukSlice from '../redux/features/TalukSlice'
import CourtSlice from '../redux/features/CourtSlice'
import CaseTypeSlice from '../redux/features/CaseTypeSlice'
import BailTypeSlice from '../redux/features/BailTypeSlice'
import RelationSlice from '../redux/features/RelationSlice'
import FilingSlice from './features/FilingSlice'
import UserTypeSlice from './features/UserTypeSlice'
import EstablishmentSlice from './features/EstablishmentSlice'
import PrisonSlice  from './features/PrisonSlice'
import ComplaintTypeSlice from './features/ComplaintTypeSlice'
import PoliceDistrictSlice from './features/PoliceDistrictSlice'
import PoliceStationSlice from './features/PoliceStationSlice'
import FIRSeachSlice from './features/FIRSeachSlice'
import AccusedSlice from './features/AccusedSlice'
import CourtTypeSlice from './features/CourtTypeSlice'
import BenchTypeSlice from './features/BenchTypeSlice'
import UserSlice from './features/UserSlice'


export default configureStore({
  reducer: {
    courttypes      : CourtTypeSlice,
    benchtypes      : BenchTypeSlice,
    states          : StateSlice,
    districts       : DistrictSlice,
    police_districts: PoliceDistrictSlice,
    police_stations : PoliceStationSlice,
    taluks          : TalukSlice,
    establishments  : EstablishmentSlice,
    courts          : CourtSlice,
    prisons         : PrisonSlice,
    casetypes       : CaseTypeSlice,
    bailtypes       : BailTypeSlice,
    complainttypes  : ComplaintTypeSlice,
    relations       : RelationSlice,
    filing          : FilingSlice,
    usertypes       : UserTypeSlice,
    fir             : FIRSeachSlice,
    accused         : AccusedSlice,
    user            : UserSlice
  }
})