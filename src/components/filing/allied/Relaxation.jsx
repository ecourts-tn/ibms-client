import api from 'api';
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button'
import InitialInput from 'components/filing/InitialInput';
import SearchIcon from '@mui/icons-material/Search'
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { SeatContext } from 'contexts/SeatContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import PetitionSearch from 'components/common/PetitionSearch';


const Relaxation = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {seats} = useContext(SeatContext)
    const {language} = useContext(LanguageContext)
    const [user, setUser] = useLocalStorage("user", null)
    const {t} = useTranslation()
    const[petition, setPetition] = useState({})
    const[bail, setBail] = useState({})
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[respondents, setRespondents] = useState([])
    const[errors, setErrors] = useState({})
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[searchForm, setSearchForm] = useState({
        judiciary:1,
        seat:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const navigate = useNavigate()
    const searchSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors] = useState({})
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
                const response = await api.get(`case/filing/pending/`)
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
                    const {petition:pet, litigants } = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    setPetition({...petition,
                        judiciary: pet.judiciary.id,
                        seat: pet.seat ? pet.seat.seat_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 3,
                        crime_registered: pet.crime_registered
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        if(eFileNumber !== ''){
            fetchDetails()
        }else{
            resetPage()
        }
    },[eFileNumber])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("case/bail/approved/single/", { params: searchForm})
            console.log(response.data)
            if(response.status === 200){
                setIsPetition(true)
                setPetition(response.data.petition)
                setPetitioners(response.data.litigants.filter(l=>l.litigant_type===1))
                setRespondents(response.data.litigants.filter(l=>l.litigant_type===2))
            }

        }catch(error){
            if(error.response){
                if(error.response.status === 404){
                    resetPage()
                    toast.error(error.response.data.message, {
                        theme:"colored"
                    })
                }
            }
            const newError = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newError[err.path] = err.message
                });
                setSearchErrors(newError)
            }
            if(error){
                toast.error(error.response.message,{
                    theme:"colored"
                })
            }
        }
    }

    const handleInitialSubmit = async () => {
        // Ensure that at least one petitioner is selected
        if (selectedPetitioner.length === 0) {
            alert("Please select at least one petitioner");
            return;
        }
        
        // Prepare the data to be sent to the backend
        const post_data = {
            petition: petition, // Petition data (you already set this state)
            litigants: selectedPetitioner.concat(selectedRespondent)
        };

        try {
            // Make the API request to submit the data
            const response = await api.post("case/filing/allied/create/", post_data);

            if (response.status === 201) {
                // Reset the form and selected data on successful submission
                resetPage();
                setSelectedPetitioner([]);
                setSelectedRespondent([]);      
                
                // Show success message
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme: "colored",
                });
                setTimeout(() => {
                    navigate('/filing/condition-relaxation/ground')
                }, 1000)
            }
        } catch (error) {
            // Handle any errors during submission
            toast.error("Error submitting the data. Please try again.", {
                theme: "colored",
            });
            console.error(error);
        }
    };
 
    const resetPage = () => {
        setSelectedPetitioner([]);
        setSelectedRespondent([]);
        setPetition({});
    };

    useEffect(() => {
        resetPage()
    },[searchForm.court_type, searchPetition])


    return(
        <>
            <ToastContainer />
            <div className="container-fluid mt-3">
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
                                <table className="table table-bordered">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={7}><strong>{t('petitioner_details')}</strong></td>
                                        </tr>
                                        <tr>
                                            <th>{t('select')}</th>
                                            <th>{t('petitioner_name')}</th>
                                            <th>{t('father_husband_guardian')}</th>
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
                                                <div className="icheck-success m-0 p-0">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`checkboxSuccess${petitioner.litigant_id}`} 
                                                        checked={isPetitionerSelected(petitioner)}
                                                        onChange={() => handlePetitionerCheckBoxChange(petitioner)}
                                                    />
                                                    <label htmlFor={`checkboxSuccess${petitioner.litigant_id}`}></label>
                                                </div>                                                                            </td>
                                            <td>{petitioner.litigant_name}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.litigant_name}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                            <td>{petitioner.relation_name}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.relation_name}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                            <td>{petitioner.age}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.age}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                            <td>{petitioner.rank}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.rank}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                            <td>{ petitioner.act}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={ petitioner.act}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                            <td>{petitioner.section}
                                                {/* <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.section}
                                                    readOnly={true}
                                                /> */}
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className='bg-navy'>
                                            <td colSpan={4}><strong>{t('condition_details')}</strong></td>
                                        </tr>
                                        <tr>
                                            <th>{t('bail_date')}</th>
                                            <th>{t('released_date')}</th>
                                            <th>{t('days_present')}</th>
                                            <th>{t('days_absent')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={6}><strong>{t('respondent_details')}</strong></td>
                                        </tr>
                                        <tr>
                                            <th>{t('select')}</th>
                                            <th>{t('respondent_name')}</th>
                                            <th>{t('designation')}</th>
                                            <th>{t('police_station')}</th>
                                            <th>{t('district')}</th>
                                            <th>{t('address')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { respondents.map((res, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="icheck-success m-0 p-0">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`checkboxSuccess${res.litigant_id}`} 
                                                            checked={isRespondentSelected(res)}
                                                            onChange={() => handleRespondentCheckBoxChange(res)}
                                                        />
                                                        <label htmlFor={`checkboxSuccess${res.litigant_id}`}></label>
                                                    </div>                                                                            
                                                </td>
                                                <td>{res.litigant_name}
                                                    {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.litigant_name}
                                                        readOnly={true}
                                                    /> */}
                                                </td>
                                                <td>{res.designation?.designation_name}
                                                    {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.designation?.designation_name}
                                                        readOnly={true}
                                                    /> */}
                                                </td>
                                                <td>{res.police_station?.station_name}
                                                    {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.police_station?.station_name}
                                                        readOnly={true}
                                                    /> */}
                                                </td>
                                                <td>{res.district.district_name}
                                                    {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.police_station?.station_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.district.district_name}
                                                        readOnly={true}
                                                    /> */}
                                                </td>
                                                <td>{res.address}
                                                    {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.address}
                                                        readOnly={true}
                                                    /> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                        { isPetition && (
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleInitialSubmit}
                                >
                                    {t('submit')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Relaxation;