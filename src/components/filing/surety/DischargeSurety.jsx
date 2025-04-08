import api from 'api';
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import InitialInput from 'components/filing/common/InitialInput';
import PetitionSearch from 'components/utils/PetitionSearch';
import { BaseContext } from 'contexts/BaseContext';


const DischargeSurety = () => {
    
    const {t} = useTranslation()
    const[bail, setBail] = useState({})
    const[cases, setCases] = useState([])
    const {setEfileNumber} = useContext(BaseContext)
    const[mainNumber, setMainNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petition, setPetition] = useState({
        court_type: '',
        bench_type: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: 6,
        bail_type: '',
        complaint_type: 2,
        crime_registered: 2,
    })
    const[errors, setErrors] = useState({})

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/approved/`)
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
        const fetchPetitionDetail= async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:mainNumber}})
                if(response.status === 200){
                    const {petition:pet} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetition({...petition,
                        court_type: pet.court_type.id,
                        bench_type: pet.bench_type ? pet.bench_type.bench_code : null,
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
        if(mainNumber){
            setEfileNumber(mainNumber)
            fetchPetitionDetail();
        }
    },[mainNumber])


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
            console.log(response.data)
          }catch(error){
            if (error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container-fluid mt-3">
                <PetitionSearch 
                    cases={cases}
                    mainNumber={mainNumber}
                    setMainNumber={setMainNumber}
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

export default DischargeSurety;