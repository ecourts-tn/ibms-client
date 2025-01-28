import React, { useState, useEffect, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as Yup from 'yup'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { PoliceDistrictContext } from 'contexts/PoliceDistrictContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { DesignationContext } from 'contexts/DesignationContext'
import { handleMobileChange, validateEmail, handleNameChange } from 'components/commonvalidation/validations';


const RespondentForm = ({addRespondent, selectedRespondent}) => {
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {policeStations}  = useContext(PoliceStationContext)
    const {designations} = useContext(DesignationContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()

    const initialState = {
        litigant_name: '',
        litigant_type: 2, 
        designation:'',
        state:'',
        district:'',
        police_station: '',
        address:'',
        mobile_number:'',
        email_address:'',
    }
    const[litigant, setLitigant] = useState(initialState)
    const[respondentPolice, setRespondentPolice] = useState(false)  

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form state
        setLitigant((prevForm) => ({
            ...prevForm,
            [name]: value,  // Dynamically update the field
        }));

        // Validate the field and update errors
        const errorMessage = validateEmail(name, value);  // Validate the email field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,  // Set the error message for the specific field
        }));
    };

    useEffect(() => {
        if(selectedRespondent){
            setLitigant(selectedRespondent)
        }
    }, [selectedRespondent])

    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        async function getCrimeDetail()  {
            try{
                const response = await api.get(`case/crime/detail/`, {
                    params:{efile_no}
                })
                if(response.status === 200){
                    const {state, district, police_station} = response.data
                    setLitigant({...litigant, 
                        state: state?.state_code,
                        district: district?.district_code,
                        police_station: police_station?.cctns_code
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efile_no){
            getCrimeDetail();
        }
    },[])



    const validationSchema = Yup.object({
        litigant_name: Yup.string().required(t('errors.respondent_name_required')),
        designation: Yup.string().required(t('errors.designation_required')),
        address: Yup.string().required(t('errors.address_required')),
        district: Yup.string().required(t('errors.district_required'))
    })
    const[errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let formIsValid = true;
        let newErrors = {};
        try{
            await validationSchema.validate(litigant, {abortEarly:false})
            addRespondent(litigant)
        }catch(error){
            console.error(error)
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
                }
        }
        // const mobileError = handleMobileChange ({ target: { value: litigant.age } }, setLitigant, litigant);
        // if (mobileError) {
        //   newErrors.mobile_number = mobileError;
        //   formIsValid = false;
        // }
    
        const emailError = validateEmail(litigant.email_address);
        if (emailError) {
          newErrors.email_address = emailError;
          formIsValid = false;
        } else {
          delete newErrors.email_address; // Clear any existing error
        }
    }

    const handleRespondentChange = () => {
        setRespondentPolice(!respondentPolice)
        if(!respondentPolice){
            setLitigant({...litigant, litigant_name: language === 'ta' ? 'தமிழ்நாடு மாநில பிரதிநிதி' : 'State of Tamil Nadu rep by'})
        }else{
            setLitigant({...litigant, litigant_name:''})
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <input type="checkbox" name={respondentPolice} onChange={handleRespondentChange} className="mr-2"/><span className="text-primary"><strong>{t('respondent_police')}</strong></span>
                    </div>
                </div>
            </div>
            {!respondentPolice && (
            <div className="form-group row">
                <label className='col-sm-3 col-form-label'>{t('respondent_name')}</label>
                <div className="col-md-6">
                    <input
                        type="text"
                        name="litigant_name"
                        value={litigant.litigant_name}
                        className={`form-control ${errors.litigant_name ? 'is-invalid' : ''}`}
                        onChange={(e) => handleNameChange(e, setLitigant, litigant, 'litigant_name')}
                    />
                    <div className="invalid-feedback">
                        { errors.litigant_name }
                    </div>
                </div>
            </div>    
            )}
            { respondentPolice && (
             <React.Fragment>
                <div className="form-group row">
                    <label htmlFor="state" className='col-sm-3 col-form-label'>{t('state')}</label>
                    <div className="col-md-6">
                        <select 
                            name="state" 
                            id="state" 
                            className="form-control"
                            value={litigant.state}
                            // disabled={ litigant.state !== '' }
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map((item, index) => (
                            <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="district" className='col-sm-3 col-form-label'>{t('district')}</label>
                    <div className="col-md-6">
                        <select 
                            name="district" 
                            id="district" 
                            className="form-control"
                            // disabled={ litigant.district !== ''}
                            value={litigant.district}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_district')}</option>
                            { districts.filter(d=>parseInt(litigant.state) === parseInt(d.state)).map((dist, index) => (
                                <option value={dist.district_code} key={index}>
                                    {language === 'ta' ? dist.district_lname : dist.district_name}
                                </option>
                            ))}
                        </select>
                    </div>                       
                </div>
                <div className="form-group row">
                    <label htmlFor="police_station" className='col-sm-3 col-form-label'>{t('police_station')}</label><br />
                    <div className="col-md-6">
                        <select 
                            name="police_station" 
                            id="police_station" 
                            // disabled={litigant.police_station !== ''}
                            className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                            value={litigant.police_station}
                            onChange={(e)=> setLitigant({...litigant, [e.target.name]: e.target.value })}
                        >
                            <option value="">{t('alerts.select_station')}</option>
                            { policeStations.filter(d=>parseInt(d.revenue_district)=== parseInt(litigant.district)).map((item, index) => (
                                <option key={index} value={item.cctns_code}>{ language==='ta' ? item.station_lname : item.station_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.police_station }
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="litigant_name" className="col-sm-3 col-form-label">{t('respondent_name')}</label>
                    <div className="col-md-6">
                        <Form.Control
                            name="litigant_name"
                            value={litigant.litigant_name}
                            className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                            readOnly={respondentPolice}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className='col-sm-3 col-form-group'>{t('designation')}</label>
                    <div className="col-md-6">
                        <select 
                            name="designation" 
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                            value={litigant.designation}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_designation')}</option>
                            { designations.map((d, index) => (
                                <option key={index} value={d.id}>{language === 'ta' ? d.designation_lname : d.designation_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.designation }</div>
                    </div>
                </div>
             </React.Fragment>   
            )}
            <React.Fragment>
                <div className='form-group row'>
                    <label className='col-sm-3 col-form-label'>{t('mobile_number')}</label>
                    <div className="col-md-6">
                        <input 
                            type="text"
                            name="mobile_number" 
                            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}` }
                            value={litigant.mobile_number}
                            onChange={(e) => handleMobileChange(e, setLitigant, litigant, 'mobile_number')}
                        />
                        <div className="invalid-feedback">{ errors.mobile_number }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{t('email_address')}</label>
                    <div className="col-md-6">
                        <input 
                            type="text"
                            name="email_address" 
                            className={`form-control ${errors.email_address ? 'is-invalid' : ''}` }
                            value={litigant.email_address}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback">{ errors.email_address }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{t('address')}</label>
                    <div className="col-md-6">
                        <textarea
                            rows={2}
                            name="address"
                            value={litigant.address}
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></textarea>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </div>
                </div>
            </React.Fragment>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}>
                        <i className="fa fa-plus mr-2"></i>{t('add_respondent')}</Button>
                </div>
            </div>
        </>
    )
}

export default RespondentForm