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
import GroundsContainer from 'components/filing/Ground';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { SeatContext } from 'contexts/SeatContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import MaterialDetails from './MaterialDetails';
import VehicleDetails from './VehicleDetails';


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


    const handlePetitionerCheckBoxChange = (petitioner) => {
        if (selectedPetitioner.includes(petitioner)) {
          // If already selected, remove the petitioner from the selected list
          setSelectedPetitioner(selectedPetitioner.filter(selected => selected.litigant_id !== petitioner.litigant_id));
        } else {
          // Otherwise, add the petitioner to the selected list
          setSelectedPetitioner([...selectedPetitioner, {
            litigant_name :petitioner.litigant_name,
            litigant_type :1, 
            rank: petitioner.rank,
            gender: petitioner.gender,
            act: petitioner.act,
            section: petitioner.section,
            relation: petitioner.relation,
            relation_name: petitioner.relation_name,
            age: petitioner.age,
            address: petitioner.address,
            mobile_number: petitioner.mobile_number,
            email_address: petitioner.email_address,
            nationality: petitioner.nationality,
          }]);
        }
    };

    const handleRespondentCheckBoxChange = (respondent) => {
        if (selectedRespondent.includes(respondent)) {
          // If already selected, remove the respondent from the selected list
          setSelectedRespondent(selectedRespondent.filter(selected => selected.litigant_id !== respondent.litigant_id));
        } else {
          // Otherwise, add the respondent to the selected list
          setSelectedRespondent([...selectedRespondent, {
            litigant_name: respondent.litigant_name,
            litigant_type: 2, 
            designation: respondent.designation?.designation_name,
            state: respondent.state.state_code,
            district: respondent.district.district_code,
            police_station: respondent.police_station.cctns_code,
            address: respondent.address,
          }]);
        }
    };

    const isPetitionerSelected = (petitioner) => selectedPetitioner.some(selected => selected.litigant_name === petitioner.litigant_name);
    const isRespondentSelected = (respondent) => selectedRespondent.some(selected => selected.litigant_name === respondent.litigant_name);
    

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
                        case_type: 3,
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

    const handleInitialSubmit = async() => {
        const post_data = {
            petition: petition,
            petitioner:selectedPetitioner,
            respondent: selectedRespondent,
        }
        if (Object.keys(selectedPetitioner).length === 0){
            alert("Please select atleast one petitioner")
            return
        }
        const response = await api.post("case/filing/relaxation/", post_data)
        if(response.status === 201){
            resetPage()
            setSelectedPetitioner([])
            setSelectedRespondent([])
            sessionStorage.setItem("efile_no", response.data.efile_number)
            toast.success(`${response.data.efile_number} details submitted successfully`,{
                theme: "colored"
            })
        }
    }

    const resetPage = () => {
        setSearchForm({...searchForm, reg_number: '', reg_year: ''})
        seteFileNumber('')
        setIsPetition(false)
        setPetition({})
        setPetitioners([])
        setRespondents([])
        setAdvocates([])
    }

    useEffect(() => {
        resetPage()
    },[searchForm.court_type, searchPetition])


    return(
        <>
            <ToastContainer />
            <div className="container px-md-5">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <div className="form-group">
                            <div>
                                <div className="icheck-primary d-inline mx-2">
                                <input 
                                    type="radio" 
                                    name="search_petition" 
                                    id="searchPetitionYes" 
                                    value={searchPetition}
                                    checked={ parseInt(searchPetition) === 1 ? true : false}
                                    onChange={(e) => setSearchPetition(1)} 
                                />
                                <label htmlFor="searchPetitionYes">{t('select_petition')}</label>
                                </div>
                                <div className="icheck-primary d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="searchPetitionNo" 
                                    name="search_petition" 
                                    value={searchPetition}
                                    checked={ parseInt(searchPetition) === 2 ? true : false } 
                                    onChange={(e) => setSearchPetition(2)}
                                />
                                <label htmlFor="searchPetitionNo">{t('search_petition')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        { parseInt(searchPetition) === 1 && (
                            <div className="form-group row">
                                <div className="col-sm-8 offset-md-2">
                                    <select 
                                        name="efile_no" 
                                        className="form-control"
                                        value={eFileNumber}
                                        onChange={(e) => seteFileNumber(e.target.value)}
                                    >
                                        <option value="">Select petition</option>
                                        { cases.map((c, index) => (
                                            <option value={c.petition.efile_number} key={index}><>{c.petition.efile_number}</> - { c.litigants.filter(l=>l.litigant_type===1).map((p, index) => (
                                                <>{index+1}. {p.litigant_name}</>
                                                ))}&nbsp;&nbsp;Vs&nbsp;&nbsp;
                                                { c.litigants.filter(l=>l.litigant_type===2).map((res, index) => (
                                                <>{res.litigant_name} {res.designation?.designation_name}</>
                                                ))} 
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-12">
                        { parseInt(searchPetition) === 2 && (
                        <form>
                            <div className="row">
                                <div className="col-md-12 d-flex justify-content-center">
                                    <div className="form-group">
                                        <div className="icheck-success d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                name="judiciary" 
                                                id="court_type_hc" 
                                                value={ searchForm.judiciary }
                                                checked={parseInt(searchForm.judiciary) === 1 ? true : false }
                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                                            />
                                            <label htmlFor="court_type_hc">{t('high_court')}</label>
                                        </div>
                                        <div className="icheck-success d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                id="court_type_dc" 
                                                name="judiciary" 
                                                value={searchForm.judiciary}
                                                checked={parseInt(searchForm.judiciary) === 2 ? true : false } 
                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 2, seat:''})}
                                            />
                                            <label htmlFor="court_type_dc">{t('district_court')}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 offset-md-2">
                                    { parseInt(searchForm.judiciary) === 2 && (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">{t('state')}</label>
                                                    <select 
                                                        name="state" 
                                                        className={`form-control ${errors.state ? 'is-invalid': ''}`}
                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">{t('alerts.select_state')}</option>
                                                        { states.map((state, index) => (
                                                        <option value={state.state_code} key={index}>
                                                            { language === 'ta' ? state.state_lname : state.state_name}
                                                        </option>
                                                        ))}
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        { searchErrors.state }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">{t('district')}</label>
                                                    <select 
                                                        name="district" 
                                                        className={`form-control ${errors.district ? 'is-invalid': ''}`}
                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">{t('alerts.select_district')}</option>
                                                        { districts.filter(district => parseInt(district.state) === parseInt(searchForm.state)).map((district, index) => (
                                                            <option value={district.district_code} key={index}>
                                                                { language === 'ta' ? district.district_lname : district.district_name }
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        { searchErrors.district }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row">
                                        { parseInt(searchForm.judiciary) === 2 && (
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <label htmlFor="">{t('est_name')}</label>
                                                <select 
                                                    name="establishment" 
                                                    className={`form-control ${errors.establishment ? 'is-invalid': ''}`}
                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">{t('alerts.select_establishment')}</option>
                                                    {establishments.filter(est=>parseInt(est.district) === parseInt(searchForm.district)).map((estd, index)=>(
                                                        <option key={index} value={estd.establishment_code}>
                                                            { language === 'ta' ? estd.establishment_lname : estd.establishment_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">
                                                    { searchErrors.establishment }
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                        { parseInt(searchForm.judiciary) === 1 && (
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <label htmlFor="">{t('hc_bench')}</label>
                                                <select 
                                                    name="seat" 
                                                    className={`form-control ${searchErrors.seat ? 'is-invalid': ''}`}
                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">{t('alerts.select_bench_type')}</option>
                                                    {seats.map((s, index)=>(
                                                        <option key={index} value={ s.seat_code}>{language === 'ta' ? s.seat_lname : s.seat_name }</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">
                                                    { searchErrors.seat }
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                        <div className="col-md-4">
                                            <label htmlFor="case_type">{t('case_type')}</label>
                                            <select 
                                                name="case_type" 
                                                id="case_type" 
                                                className={`form-control ${searchErrors.case_type ? 'is-invalid' : null}`}
                                                onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_case_type')}</option>
                                                <option value="1">Bail Application</option>
                                            </select>
                                            <div className="invalid-feedback">
                                                { searchErrors.case_type }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-10 offset-md-1">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="form-group">
                                                        <input 
                                                            type="text" 
                                                            className={`form-control ${searchErrors.reg_number ? 'is-invalid': ''}`}
                                                            name="reg_number"
                                                            value={searchForm.reg_number}
                                                            onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                            placeholder={t('case_number')}
                                                        />
                                                        <div className="invalid-feedback">
                                                            { searchErrors.reg_number }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <input 
                                                            type="text" 
                                                            className={`form-control ${searchErrors.reg_year ? 'is-invalid': ''}`}
                                                            name="reg_year"
                                                            value={searchForm.reg_year}
                                                            onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                            placeholder={t('case_year')}
                                                        />
                                                        <div className="invalid-feedback">
                                                            { searchErrors.reg_year }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <Button 
                                                        variant='contained'
                                                        color="primary"
                                                        endIcon={<SearchIcon />}
                                                        onClick={handleSearch}
                                                    >
                                                        {t('search')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        )}
                    </div>
                    <div className="container-fluid mt-5 px-5">
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