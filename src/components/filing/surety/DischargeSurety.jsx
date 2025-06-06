import api from 'api';
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import InitialInput from 'components/filing/InitialInput';
import PetitionSearch from 'components/utils/PetitionSearch';
import { BaseContext } from 'contexts/BaseContext';
import SuretyDetails  from './SuretyDetails';


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
    const [sureties, setSureties] = useState([])
    const [surety, setSurety] = useState([])
    const [selectedSurety, setSelectedSurety] = useState([])  
    const [showModal, setShowModal] = useState(false);
    
    const handleShow = (surety) => {
        setSurety(surety);  
        setShowModal(true); 
    };
    
    const handleClose = () => {
        setShowModal(false);  
    };

    const isSuretySelected = (surety) => selectedSurety.includes(surety.surety_id);
    
    const handleSuretyCheckBoxChange = (surety) => {
        const isSelected = isSuretySelected(surety);
        if (isSelected) {
          setSelectedSurety(selectedSurety.filter(id => id !== surety.surety_id));
        } else {
          setSelectedSurety([...selectedSurety, surety.surety_id]);
        }
    };


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/approved/`)
                if(response.status === 200){
                    setCases(response.data.results)
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
            // setEfileNumber(mainNumber)
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
        <div className="container-fluid mt-3">
            <ToastContainer />
            <PetitionSearch 
                cases={cases}
                mainNumber={mainNumber}
                setMainNumber={setMainNumber}
            />
            <div className="row">
                <div className="col-md-12">
                { isPetition && (
                    <React.Fragment>
                        <InitialInput petition={bail} />
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr className="bg-navy">
                                    <td colSpan={9}><strong>{t('surety_details')}</strong></td>
                                </tr>
                                <tr>
                                    <th>{t('select')}</th>
                                    <th>{t('surety_name')}</th>
                                    <th>{t('father_husband_guardian')}</th>
                                    <th>{t('aadhar_number')}</th>
                                    <th>{t('mobile_number')}</th>
                                    <th>{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sureties.map((s, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="icheck-success">
                                                <input 
                                                    type="checkbox" 
                                                    id={`checkboxSuccess${s.surety_id}`} 
                                                    checked={isSuretySelected(s)} 
                                                    onChange={() => handleSuretyCheckBoxChange(s)} 
                                                />
                                                <label htmlFor={`checkboxSuccess${s.surety_id}`}></label>
                                            </div>                                                                            
                                        </td>
                                        <td>{s.surety_name}</td>
                                        <td>{s.relative_name}</td>
                                        <td>{s.aadhar_number}</td>
                                        <td>{s.mobile_number}</td>
                                        <td>
                                            <span className="badge badge-info badge-pill" onClick={() => handleShow(s)}>View</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center">
                            <Button
                                variant='contained'
                                color="success"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </div>
                    </React.Fragment>
                )}
                </div>
            </div>
        </div>
    )
}

export default DischargeSurety;