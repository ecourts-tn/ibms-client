import api from 'api';
import * as Yup from 'yup'
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button'
import InitialInput from '../common/InitialInput';
import { toast, ToastContainer } from 'react-toastify';
import PetitionSearch from 'components/utils/PetitionSearch';
import ConditionDetail from './ConditionDetail';
import PassportDetail from './PassportDetail';
import PropertyDetail from './PropertyDetail';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { MasterContext } from 'contexts/MasterContext';


const Allied = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {masters:{casetypes}} = useContext(MasterContext)
    const[bail, setBail] = useState({})
    const[mainNumber, setMainNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[respondents, setRespondents] = useState([])
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)
    const [passportDetails, setPassportDetails] = useState([
        { nationality: '', passport_type: '', passport_authority: '', issued_date: '', expiry_date: '' }
    ]);
    const [materials, setMaterials] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const[petition, setPetition] = useState({
        judiciary: '',
        bench_type: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: '',
        bail_type: '',
        complaint_type: '',
        crime_registered: '',
        main_petition: ''
    })
    const[errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        case_type: Yup.string().required(t('alerts.select_case_type'))
    })

    const isPetitionerSelected = (petitioners) => {
        return selectedPetitioner.includes(petitioners.litigant_id);
    };
    const isRespondentSelected = (respondent) => selectedRespondent.includes(respondent.litigant_id);

    const handlePetitionerCheckBoxChange = (petitioner) => {
        const isSelected = isPetitionerSelected(petitioner);
        if (isSelected) {
          // Remove from selected petitioners if unchecked
          setSelectedPetitioner(selectedPetitioner.filter(id => id !== petitioner.litigant_id));
        } else {
          // Add to selected petitioners if checked
          setSelectedPetitioner([...selectedPetitioner, petitioner.litigant_id]);
        }
    };


    const handleRespondentCheckBoxChange = (respondent) => {
        const isSelected = isRespondentSelected(respondent);
        if (isSelected) {
            // Remove from selected if already selected
            setSelectedRespondent(selectedRespondent.filter(r => r !== respondent.litigant_id));
        } else {
            // Add to selected if not already selected
            setSelectedRespondent([...selectedRespondent,respondent.litigant_id]);
        }
    };

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
        const fetchDetails = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:mainNumber}})
                if(response.status === 200){
                    const {petition:main, litigants} = response.data
                    console.log(response.data)
                    setIsPetition(true)
                    setBail(main)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    setPetition((prevPetition) => ({
                        ...prevPetition,
                        judiciary: main.judiciary?.id,
                        bench_type: main.bench_type ? main.bench_type.bench_code : null,
                        state: main.state ? main.state.state_code : null,
                        district: main.district ? main.district.district_code : null,
                        establishment: main.establishment ? main.establishment.establishment_code : null,
                        court: main.court ? main.court.court_code : null,
                        bail_type: main.bail_type ? main.bail_type.type_code : null,
                        complaint_type: main.complaint_type ? main.complaint_type.id : null,
                        crime_registered: main.crime_registered ? main.crime_registered.id : null,
                        main_petition: main.efile_number,
                    }));
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchDetails()
    },[mainNumber])


    const handleInitialSubmit = async () => {
        if (selectedPetitioner.length === 0) {
            setErrors({...errors, petitioners: "Please select at least one petitioner"})
            return
        }
        if (selectedRespondent.length === 0) {
            setErrors({...errors, respondents: "Please select at least one petitioner"})
            return
        }    
        // Prepare the data to be sent to the backend
        const post_data = {
            petition: petition, 
            litigants: selectedPetitioner.concat(selectedRespondent),
            ...(parseInt(petition.case_type) === 6 && { passport: passportDetails }),
            ...(parseInt(petition.case_type) === 7 && { 
                materials: materials, 
                vehicles: vehicles 
            }) 
        };

        try{
            await validationSchema.validate(petition, {abortEarly:false})
        }catch(validationError){
            if(validationError.inner){
                const newErrors = {}
                validationError.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            return;
        }
       
        try {
            setLoading(true)
            const response = await api.post("case/filing/allied/create/", post_data);
            if (response.status === 201) {
                // Reset the form and selected data on successful submission
                resetPage();
                setSelectedPetitioner([]);
                setSelectedRespondent([]);
                
                // Store efile number in sessionStorage
                sessionStorage.setItem("efile_no", response.data.efile_number);
                
                // Show success message
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme: "colored",
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Server error: ${error.response.statusText}`, { theme: "colored" });
            } else {
                toast.error("Network error. Please try again later.", { theme: "colored" });
            }
        }finally{
            setLoading(false)
        }
    };

    const resetPage = () => {
        setSelectedPetitioner([]);
        setSelectedRespondent([]);
        setPetition({});
        setMaterials([]);  // Reset materials
        setVehicles([]);  
    };


    return(
        <>
            <ToastContainer />
            { loading && <Loading />}
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
                                <div className="form-group row my-3">
                                    <label htmlFor="" className="col-sm-2">{t('case_type')}</label>
                                    <div className="col-md-4">
                                        <select 
                                            name="case_type"
                                            className={`form-control ${errors.case_type ? 'is-invalid' : ''}`}
                                            onChange={(e) =>setPetition({...petition, [e.target.name]:e.target.value})}
                                        >
                                            <option value="">{t('alerts.select_case_type')}</option>
                                            { casetypes.filter((c) => c.type_flag === 2).map((c, index) => (
                                                <option key={index} value={c.id}>{ language === 'ta' ? c.type_lfull_form : c.type_full_form}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.case_type }
                                        </div>
                                    </div>
                                </div>
                                <InitialInput petition={bail} />
                                <p className="text-danger"><strong>{ errors.petitioners }</strong></p>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={7}><strong>{t('petitioner_details')}</strong></td>
                                        </tr>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th>{t('petitioner_name')}</th>
                                            <th>{t('father_name')}</th>
                                            <th>{t('age')}</th>
                                            <th>{t('accused_rank')}</th>
                                            <th>{t('act')}</th>
                                            <th>{t('section')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { petitioners.map((petitioner, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`checkboxSuccess${petitioner.litigant_id}`} 
                                                        checked={isPetitionerSelected(petitioner)}
                                                        onChange={() => handlePetitionerCheckBoxChange(petitioner)}
                                                    />
                                                    <label htmlFor={`checkboxSuccess${petitioner.litigant_id}`}></label>
                                                </div>                                                                            </td>
                                            <td>{petitioner.litigant_name}</td>
                                            <td>{petitioner.relation_name}</td>
                                            <td>{petitioner.age}</td>
                                            <td>{petitioner.rank}</td>
                                            <td>{ petitioner.act}</td>
                                            <td>{petitioner.section}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-danger"><strong>{ errors.respondents }</strong></p>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={6}><strong>{t('respondent_details')}</strong></td>
                                        </tr>
                                        <tr>
                                            <th className='text-center'>#</th>
                                            <th>{t('respondent_name')}</th>
                                            <th>{t('designation')}</th>
                                            <th>{t('police_station')}</th>
                                            <th>{t('address')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { respondents.map((res, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`checkboxSuccess${res.litigant_id}`} 
                                                            checked={isRespondentSelected(res)}
                                                            onChange={() => handleRespondentCheckBoxChange(res)}
                                                        />
                                                        <label htmlFor={`checkboxSuccess${res.litigant_id}`}></label>
                                                    </div>                                                                            
                                                </td>
                                                <td>{res.litigant_name}</td>
                                                <td>{ language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</td>
                                                <td>{ language === 'ta' ? res.police_station?.station_lname : res.police_station?.station_name }</td>
                                                <td>{res.address}, { language === 'ta' ? res.district.district_lname : res.district.district_name }</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                { (parseInt(petition.case_type) === 3 || parseInt(petition.case_type) === 4 || parseInt(petition.case_type) === 5) && (<ConditionDetail />)}
                                {parseInt(petition.case_type) === 6 && (
    <PassportDetail passportDetails={passportDetails} setPassportDetails={setPassportDetails} />
)}
                                { petition.case_type && parseInt(petition.case_type) === 7 && (
    <PropertyDetail 
        materials={materials} 
        setMaterials={setMaterials} 
        vehicles={vehicles} 
        setVehicles={setVehicles} 
    />
)}
                            </>
                        )}
                        { isPetition && (
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleInitialSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Allied;