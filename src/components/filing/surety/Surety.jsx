import api from 'api';
import * as Yup from 'yup'
import React, { useState, useEffect,} from 'react';
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search'
import { toast, ToastContainer } from 'react-toastify';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import InitialInput from 'components/filing/InitialInput';
import PetitionSearch from 'components/common/PetitionSearch';


const Surety = () => {

    const {t} = useTranslation()
    const[bail, setBail] = useState({})
    const[cases, setCases] = useState([])
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petition, setPetition] = useState({
        judiciary: '',
        seat: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: 6,
        bail_type: '',
        complaint_type: 2,
        crime_registered: 2,
    })

    const [user, setUser] = useLocalStorage("user", null)

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    useEffect(() => {
        const fetchDetails = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:eFileNumber}})
                if(response.status === 200){
                    const {petition:pet} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetition({...petition,
                        judiciary: pet.judiciary?.id,
                        seat: pet.seat ? pet.seat?.seat_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 6,
                        reg_type: pet.reg_type.id,
                        reg_number: pet.reg_number,
                        reg_year: pet.reg_year,
                        registration_date: pet.registration_date
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchDetails();
    },[eFileNumber])

    console.log(petition)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try{
            // await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("case/filing/surety/create/", petition)
            if(response.status === 201){
                sessionStorage.setItem("efile_no", response.data.efile_number)
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme:"colored"
                }) 
            }
          }catch(error){
            if(error.response?.status ===500){
                toast.error("Internal Server Error, Please try later!!!", {theme:"colored"})
            }
            if(error?.response){
                toast.error(error.response?.data.message, {theme:"colored"})
            }
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container px-md-5">
                <PetitionSearch 
                    cases={cases}
                    eFileNumber={eFileNumber}
                    seteFileNumber={seteFileNumber}
                />
                <div className="row">
                    <div className="col-md-12">
                        { isPetition && (
                        <>
                            <InitialInput petition={bail} />
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant='contained'
                                    color="success"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surety;