import api from 'api';
import * as Yup from 'yup'
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import PetitionSearch from 'components/utils/PetitionSearch';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { MasterContext } from 'contexts/MasterContext';
import { RequiredField } from 'utils';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';



const PayCourtFee = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {masters:{casetypes}} = useContext(MasterContext)
    const[mainNumber, setMainNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)
    const[form, setForm] = useState({
        txnid:null,
        amount:"",
        scamt:"0.00",
        udf1:"",
        udf2:"",
        udf3:"",
    })
    const[errors, setErrors] = useState({})
    const[otp, setOtp] = useState('')
    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)
    const validationSchema = Yup.object({
        udf1: Yup.string().required("Payer name is required"),
        udf2: Yup.string().required('Email address is required').email('Enter valid email address'),
        udf3: Yup.string().required(t('errors.mobile_required')).matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
        amount: Yup.string().required("Amount is required field").matches(/^\d{1,10}$/, 'Amount is required field')
    })

    useEffect(() => {
        const fetchPetition = async() => {
            try{
                setLoading(true)
                const response = await api.get(`case/filing/pending/`, {
                    params: {
                        page: '',
                        page_size: '',
                        search: '',
                      },
                })
                setCases(response.data.results)
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition()
    }, [])

    const sendMobileOTP = async() => {
            try{
                await validationSchema.validate(form, {abortEarly: false})
                if(mobileOtp){
                    toast.success("OTP already verified successfully.", {
                        theme: "colored"
                    })
                    return
                }
                toast.success("OTP has been sent your mobile number",{
                    theme:"colored"
                })
                setMobileOtp(true)
            }catch(error){
                if(error.inner){
                    const newError = {}
                    error.inner.forEach((err)=> {
                        newError[err.path] = err.message
                    })
                    setErrors(newError)                    
                }
            }
        }
    
        const verifyMobile = (otp) => {
            if(parseInt(otp) === 123456){
                toast.success("Mobile otp verified successfully",{
                    theme:"colored"
                })
                setMobileVerified(true)
            }else{
                toast.error("Invalid OTP. Please enter valid OTP",{
                    theme:"colored"
                })
                setMobileVerified(false)
                setMobileOtp(true)
            }
        }
    
    

    useEffect(() => {
        const fetchDetails = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:mainNumber}})
                if(response.status === 200){
                    const {petition:main, litigants} = response.data
                    setIsPetition(true)
                    setForm((prevPetition) => ({
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


    const handleSubmit = async () => {   

        try{
            await validationSchema.validate(form, {abortEarly:false})
        }catch(error){
            if(error.inner){
                console.log(error.inner)
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            return;
        }
       
        try {
            setLoading(true)
            const response = await api.post("case/filing/allied/create/", form);
            if (response.status === 201) {
                                
                // Store efile number in sessionStorage
                sessionStorage.setItem("efile_no", response.data.efile_number);
                
                // Show success message
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme: "colored",
                });
            }
        } catch (error) {
            if (errors.response) {
                toast.error(`Server error: ${errors.response.statusText}`, { theme: "colored" });
            } else {
                toast.error("Network errors. Please try again later.", { theme: "colored" });
            }
        }finally{
            setLoading(false)
        }
    };

    return(
        <React.Fragment>
            <ToastContainer />
            { loading && <Loading />}
            <div className="container mt-5" style={{minHeight:500}}>
                <PetitionSearch 
                    cases={cases}
                    mainNumber={mainNumber}
                    setMainNumber={setMainNumber}
                />
                <div className="container my-4">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-10">
                            <div className="form-group row mb-3">
                                <label htmlFor="" className="col-sm-3 col-form-label">{t('payer_name')}<RequiredField /></label>
                                <div className="col-md-4">
                                    <input 
                                        type="text"
                                        name="udf1" 
                                        className={`form-control ${errors.udf1 ? 'is-invalid' : null }`}
                                        value={form.udf1}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        // readOnly={true}
                                    />
                                    <div className="invalid-feedback">{ errors.udf1 }</div>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="" className='col-sm-3 col-form-label'>{t('mobile_number')}<RequiredField /></label>
                                <div className="col-md-4">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.udf3 ? 'is-invalid' : null }`}
                                        name="udf3"
                                        value={form.udf3}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            if(value.length <= 10){
                                                setForm({...form, [e.target.name]: value})
                                            }}
                                        }
                                    />
                                    <div className="invalid-feedback">{ errors.udf3 }</div>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="" className='col-sm-3 col-form-label'>{t('email_address')}<RequiredField /></label>
                                <div className="col-md-4">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.udf2 ? 'is-invalid' : null }`}
                                        name="udf2"
                                        value={form.udf2}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                    <div className="invalid-feedback">{ errors.udf2 }</div>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="" className="col-sm-3 col-form-label">{t('amount')}<RequiredField /></label>
                                <div className="col-md-2">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.amount ? 'is-invalid' : null}`}
                                        name="amount"
                                        value={form.amount}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.amount }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <div className="col-sm-3"></div>
                                    { !mobileVerified && (
                                    <div className="col-md-2">
                                        <div className="form-group mb-3">
                                            <Button
                                                variant='contained'
                                                color="warning"
                                                onClick={sendMobileOTP}
                                                disabled={mobileOtp}
                                                className='btn-block'
                                            >{t('send_otp')}</Button>
                                        </div>
                                    </div>
                                    )}
                                    { mobileOtp && !mobileVerified && (
                                    <React.Fragment>
                                        <div className="col-md-1">
                                            <div className="form-group mb-3">
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group mb-3">
                                                <Button
                                                    variant='contained'
                                                    color='success'
                                                    onClick={() => verifyMobile(otp)}
                                                >{t('verify')}</Button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                    )}
                            </div>
                            { mobileVerified && (
                                <React.Fragment>
                                    <div className='form-group row mb-3'>
                                        <div className="col-sm-3"></div>
                                        <div className="col-md-3">
                                            <CheckCircleRoundedIcon color="success"/>
                                            <span className="text-success ml-1"><strong>{t('otp_verified')}</strong></span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-3"></div>
                                        <div className="col-md-3">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleSubmit}
                                            >Continue Payment</Button>
                                        </div>
                                    </div>
                                </React.Fragment>                           
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PayCourtFee;