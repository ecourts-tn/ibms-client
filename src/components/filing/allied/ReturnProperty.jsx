import api from 'api';
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from '@mui/material/Button'
import Payment from 'components/payment/Payment';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import InitialInput from '../InitialInput';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search'
import Document from 'components/filing/Document';
import Grounds from 'components/filing/Grounds';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { SeatContext } from 'contexts/SeatContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import MaterialDetails from './MaterialDetails';
import VehicleDetails from './VehicleDetails';
import PetitionSearch from 'components/common/PetitionSearch';


const RetrunProperty = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {seats} = useContext(SeatContext)
    const[bail, setBail] = useState({})
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})
    const [grounds, setGrounds] = useState('')
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
    const materialState = {
        name: '',
        quantity:'',
        nature:'',
        is_produced: '',
        produced_date: '',
        reason: ''
    }
    const[material, setMaterial] = useState(materialState)
    const[materialErrors, setMaterialErrors] = useState({})
    const[materials, setMaterials] = useState([])
    const vehicleState = {
        vehicle_name: '',
        owner_details: '',
        vehicle_number: '',
        fastag_details: '',
        is_owner_accused: ''
    }
    const[vehicle, setVehicle] = useState(vehicleState)
    const[vehicles, setVehicles] = useState([])
    const[propertyType, setPropertyType] = useState(1)
    const[petition, setPetition] = useState({})
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
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


    // const handlePetitionerCheckBoxChange = (petitioner) => {
    //     if (selectedPetitioner.includes(petitioner)) {
    //       // If already selected, remove the petitioner from the selected list
    //       setSelectedPetitioner(selectedPetitioner.filter(selected => selected.litigant_id !== petitioner.litigant_id));
    //     } else {
    //       // Otherwise, add the petitioner to the selected list
    //       setSelectedPetitioner([...selectedPetitioner, {
    //         litigant_name :petitioner.litigant_name,
    //         litigant_type :1, 
    //         rank: petitioner.rank,
    //         gender: petitioner.gender,
    //         act: petitioner.act,
    //         section: petitioner.section,
    //         relation: petitioner.relation,
    //         relation_name: petitioner.relation_name,
    //         age: petitioner.age,
    //         address: petitioner.address,
    //         mobile_number: petitioner.mobile_number,
    //         email_address: petitioner.email_address,
    //         nationality: petitioner.nationality,
    //       }]);
    //     }
    // };

    // const handleRespondentCheckBoxChange = (respondent) => {
    //     if (selectedRespondent.includes(respondent)) {
    //       // If already selected, remove the respondent from the selected list
    //       setSelectedRespondent(selectedRespondent.filter(selected => selected.litigant_id !== respondent.litigant_id));
    //     } else {
    //       // Otherwise, add the respondent to the selected list
    //       setSelectedRespondent([...selectedRespondent, {
    //         litigant_name: respondent.litigant_name,
    //         litigant_type: 2, 
    //         designation: respondent.designation?.designation_name,
    //         state: respondent.state.state_code,
    //         district: respondent.district.district_code,
    //         police_station: respondent.police_station.cctns_code,
    //         address: respondent.address,
    //       }]);
    //     }
    // };

    // const isPetitionerSelected = (petitioner) => selectedPetitioner.some(selected => selected.litigant_name === petitioner.litigant_name);
    // const isRespondentSelected = (respondent) => selectedRespondent.some(selected => selected.litigant_name === respondent.litigant_name);
    

    const addMaterial = () => {}

    const handleSubmit = async() => {

    }
    
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
                    const {petition:pet, litigants, advocates} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    setAdvocates(advocates)
                    setPetition({...petition,
                        judiciary: pet.judiciary.id,
                        seat: pet.seat ? pet.seat.seat_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 10,
                        bail_type: pet.bail_type ? pet.bail_type.type_code: null,
                        complaint_type: pet.complaint_type.id,
                        crime_registered: pet.crime_registered,
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
                setAdvocates(response.data.advocate)
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

    // const handleInitialSubmit = async() => {
    //     const post_data = {
    //         petition: petition,
    //         petitioner:selectedPetitioner,
    //         respondent: selectedRespondent,
    //     }
    //     if (Object.keys(selectedPetitioner).length === 0){
    //         alert("Please select atleast one petitioner")
    //         return
    //     }
    //     const response = await api.post("case/filing/relaxation/", post_data)
    //     if(response.status === 201){
    //         resetPage()
    //         setSelectedPetitioner([])
    //         setSelectedRespondent([])
    //         sessionStorage.setItem("efile_no", response.data.efile_number)
    //         toast.success(`${response.data.efile_number} details submitted successfully`,{
    //             theme: "colored"
    //         })
    //     }
    // }

    const handleInitialSubmit = async () => {
        // Ensure that at least one petitioner is selected
        if (selectedPetitioner.length === 0) {
            alert("Please select at least one petitioner");
            return;
        }

        let propertyDetails = null;

        if (parseInt(propertyType) === 1) {
            // Include material details for propertyType 1
            propertyDetails = { propertyType: 1, material };
        } else if (parseInt(propertyType) === 2) {
            // Include vehicle details for propertyType 2
            propertyDetails = { propertyType: 2, vehicle };
        }
        
        // Prepare the data to be sent to the backend
        const post_data = {
            petition: petition, // Petition data (you already set this state)
            // petitioner: selectedPetitioner, // Only the selected petitioners
            // respondent: selectedRespondent, // Only the selected respondents
            litigants: selectedPetitioner.concat(selectedRespondent),
            propertyDetails,
            
        };

        try {
            // Make the API request to submit the data
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
            // Handle any errors during submission
            toast.error("Error submitting the data. Please try again.", {
                theme: "colored",
            });
            console.error(error);
        }
    };

    // const resetPage = () => {
    //     setSearchForm({...searchForm, reg_number: '', reg_year: ''})
    //     seteFileNumber('')
    //     setIsPetition(false)
    //     setPetition({})
    //     setPetitioners([])
    //     setRespondents([])
    //     setAdvocates([])
    // }

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
                                <table className="table table-bordered table-striped">
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
                                                <div className="icheck-success">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`checkboxSuccess${petitioner.litigant_id}`} 
                                                        checked={isPetitionerSelected(petitioner)}
                                                        onChange={() => handlePetitionerCheckBoxChange(petitioner)}
                                                    />
                                                    <label htmlFor={`checkboxSuccess${petitioner.litigant_id}`}></label>
                                                </div>                                                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.litigant_name}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.relation_name}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.age}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.rank}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={ petitioner.act}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.section}
                                                    readOnly={true}
                                                />
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-striped">
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
                                                    <div className="icheck-success">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`checkboxSuccess${res.litigant_id}`} 
                                                            checked={isRespondentSelected(res)}
                                                            onChange={() => handleRespondentCheckBoxChange(res)}
                                                        />
                                                        <label htmlFor={`checkboxSuccess${res.litigant_id}`}></label>
                                                    </div>                                                                            
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.litigant_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.designation?.designation_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
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
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.address}
                                                        readOnly={true}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="card card-navy">
                                    <div className="card-header">
                                        <strong>{t('property_details')}</strong>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group row">
                                                    <label htmlFor="" className='col-sm-2 form-label'>{t('property_type')}</label>
                                                    <div className="col-sm-9">
                                                        <div className="icheck-primary d-inline mx-2">
                                                        <input 
                                                            type="radio" 
                                                            name="property_type" 
                                                            id="propertyTypeYes" 
                                                            value={propertyType}
                                                            checked={ parseInt(propertyType) === 1 ? true : false}
                                                            onChange={(e) => setPropertyType(1)} 
                                                        />
                                                        <label htmlFor="propertyTypeYes">{t('material')}</label>
                                                        </div>
                                                        <div className="icheck-primary d-inline mx-2">
                                                        <input 
                                                            type="radio" 
                                                            id="propertyTypeNo" 
                                                            name="property_type" 
                                                            value={propertyType}
                                                            checked={ parseInt(propertyType) === 2 ? true : false } 
                                                            onChange={(e) => setPropertyType(2)}
                                                        />
                                                        <label htmlFor="propertyTypeNo">{t('vehicle')}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                { parseInt(propertyType) === 1 && (
                                                    <MaterialDetails material={material} setMaterial={setMaterial} addMaterial={addMaterial}/>
                                                )}
                                                { parseInt(propertyType) === 2 && (
                                                    <VehicleDetails  vehicle={vehicle} setVehicle={setVehicle}/>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default RetrunProperty;