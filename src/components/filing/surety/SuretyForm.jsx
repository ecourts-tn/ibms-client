import React, {useState, useEffect, useContext, useRef} from 'react'
import { RequiredField } from 'utils'
import api from 'api'
import {toast,ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { TalukContext } from 'contexts/TalukContext'
import { RelationContext } from 'contexts/RelationContext'
import * as Yup from 'yup'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { handleMobileChange, handleAadharChange, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/commonvalidation/validations';



const SuretyForm = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {taluks}    = useContext(TalukContext)
    const {relations} = useContext(RelationContext)  
    const {t} = useTranslation()
    
    const initialState = {
        cino: '',
        surety_name: '',
        relation: '',
        relative_name:'',
        aadhar_number: '',
        address: '',
        state: '',
        district: '',
        taluk: '',
        pincode: '',
        mobile_number: '',
        email_address: '',
        residing_years: '',
        property_type: '',
        survey_number: '',
        site_location:'',
        site_area:'',
        site_valuation:'',
        rent_bill_surety_name: false,
        property_document:'',
        employment_type: '',
        business_address: '',
        business_state: '',
        business_district: '',
        business_taluk: '',
        business_nature: '',
        business_rent_paid: '',
        is_rent_bill_name: false,
        business_document:'',
        employer_name: '',
        designation: '',
        employer_address: '',
        employer_state: '',
        employer_district: '',
        employer_taluk: '',
        service_length: '',
        pf_amount: '',
        property_details: '',
        income_tax_paid: '',
        employment_document: '',
        bank_accounts: [],
        accused_duration_year: '',
        accused_duration_month: '',
        is_related: false,
        relation_details: '',
        others_surety:'',
        litigation_details: '',
        other_particulars: '',
        surety_amount: '',
        photo: null,
        signature:null,
        identity_proof:null,
        aadhar_card: null
    }
    const[surety, setSurety] = useState(initialState);
    const[sureties, setSureties] = useState([])
    const initialAccount = {
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: ''
    }
    const[account, setAccount] = useState(initialAccount)
    const[bankAccounts, setBankAccounts] = useState([])
    const[errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        surety_name: Yup.string().required(),
        relation: Yup.string().required(),
        relative_name: Yup.string().required(),
        aadhar_number: Yup.number().required().typeError("Aadhar number should be numeric"),
        state: Yup.string().required(),
        district: Yup.string().required(),
        taluk: Yup.string().required(),
        address: Yup.string().required(),
        pincode: Yup.number().required().typeError("Pincode must be numeric"),
        mobile_number: Yup.number().required().typeError("Mobile number must be numeric"),
        residing_years: Yup.string().required(),
        property_type: Yup.string().required(),
        accused_duration_year: Yup.number().required().typeError("This field should be numeric"),
        accused_duration_month: Yup.number().required().typeError("This field should be numeric"),
        is_related: Yup.boolean().required(),
        relation_details: Yup.string().required(),
        others_surety:Yup.string().required(),
        litigation_details: Yup.string().required(),
        other_particulars: Yup.string().required(),
        surety_amount: Yup.number().required().typeError("Amount should be numeric"),
        photo: Yup.string().required(),
        signature:Yup.string().required(),
        identity_proof:Yup.string().required(),
        aadhar_card:Yup.string().required()
    })

    useEffect(()=> {
        const fecthSureties = async() => {
            const efile_no = sessionStorage.getItem("efile_no")
            const response = await api.get("case/surety/list/", {
                params: {efile_no}
            })
            if(response.status === 200){
                setSureties(response.data)
            }
        }
        fecthSureties();
    }, [])

    const deleteSurety = async(surety) => {
        try{
            const newSureties = sureties.filter((s) => {
                return s.surety_id !== surety.surety_id
            })
            const response = await api.delete("case/surety/delete/", {
                params:{id:surety.surety_id}
            })
            if(response.status === 204){
                toast.error(`${surety.surety_id} - surety deleted successfully`, {
                    theme: "colored"
                })
                setSureties(newSureties)
            }
            
        }catch(error){
            console.log(error)
        }
    }


    const handleSubmit = async(e) => {
        e.preventDefault()
        const efile_no = sessionStorage.getItem("efile_no")
        try{
            await validationSchema.validate(surety, {abortEarly:false})
            
            const postData = {
                ...surety,
               bank_accounts: bankAccounts,
            };

            // console.log("PostData to send:", postData);
           
            const response = await api.post("case/surety/create/", postData, {
                params: { efile_no },
                headers: {
                    'Content-Type': 'application/json' // Send as JSON
                }
            });
            if(response.status === 201){
                toast.success("Surety Details added successfully", {
                    theme:"colored"
                })
                setSurety(initialState);
                setBankAccounts([]);
            }
        }catch(error){
            if(error.inner){
                console.log(error.inner)
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

   

    // const addBankAccount = () => {
    //     setBankAccounts([...bankAccounts, account])
    //     toast.success("Bank details added successfully", {
    //         theme : "colored"
    //     })
    //     setAccount(initialAccount)
    // }

    const addBankAccount = () => {
        if (
            account.bank_name && 
            account.branch_name && 
            account.account_number && 
            account.ifsc_code
        ) {
            setBankAccounts([...bankAccounts, account]);
            setAccount(initialAccount); // Reset account fields
        } else {
            // Show error or message to user that all fields are required
            toast.error("All fields are required for the bank account.", {
                theme: "colored",
            });
        }
    };

    const handleNameChange = (e, setState, state, field) => {
        setState({
            ...state,
            [field]: e.target.value,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
  
        // Update form state
        setSurety((prevForm) => ({
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

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0]; // Get the first file
        if (!file) return; // If no file is selected, return early
    
        let errorMessage = '';
    
        // PDF Validation (for notary_order and reg_certificate)
        // if (fileType === 'notary_order' || fileType === 'reg_certificate') {
        //     // Validate file type (only PDF)
        //     if (file.type !== 'application/pdf') {
        //         errorMessage = 'Only PDF files are allowed for Notary Order and Bar Certificate.';
        //     }
    
        //     // Validate file size (max 5MB for PDF)
        //     if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
        //         errorMessage = errorMessage || 'File size must be less than 5MB.';
        //     }
        // }
    
        // Image Validation (for profile_photo)
        if (fileType === 'photo' || fileType === 'signature' ) {
            // Validate file type (only images allowed)
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedImageTypes.includes(file.type)) {
                errorMessage = 'Only image files (JPG, JPEG, PNG, GIF) are allowed for Profile Photo.';
            }
    
            // Validate file size (max 3MB for image)
            if (file.size > 3 * 1024 * 1024) { // 3MB in bytes
                errorMessage = errorMessage || 'Image size must be less than 3MB.';
            }
        }

        else if (fileType === 'identity_proof' || fileType === 'aadhar_card' ) {
            // Check for allowed file types (PDF or Image)
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (file.type === 'application/pdf') {
                // If it's a PDF, no need to check further for image types
                if (file.size > 5 * 1024 * 1024) { // 5MB for PDF size limit
                    errorMessage = errorMessage || 'File size must be less than 5MB.';
                }
            } else if (!allowedImageTypes.includes(file.type)) {
                // If it's not a valid image type
                errorMessage = 'Only image files (JPG, JPEG, PNG, GIF) or PDF are allowed for Identity Proof.';
            } else if (file.size > 3 * 1024 * 1024) { // Max 3MB for images
                // Validate file size (max 3MB for image)
                errorMessage = errorMessage || 'Image size must be less than 3MB.';
            }
        }
    
        // If there's an error, show it
        if (errorMessage) {
            setErrors({
                ...errors,
                [fileType]: errorMessage,
            });
            return; // Stop further execution if file type or size is invalid
        }
    
        // If validation passes, update the form with the file data
        setSurety({
            ...surety,
            [fileType]: file.name,
        });
    
        // Clear any previous errors for this file type
        setErrors({
            ...errors,
            [fileType]: '',
        });
    };


    return (
        <div className="container">
            {/* <form onSubmit={handleSubmit} encType='multipart/form-data' method='POST'> */}
                <ToastContainer />
                <div className="row">
                    <div className="col-md-12">
                        { Object.keys(sureties).length > 0 && (
                        <table className="table table-striped table-bordered table-sm">
                            <thead className="bg-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>{t('surety_name')}</th>
                                    <th>{t('relationship_name')}</th>
                                    <th>{t('aadhaar_number')}</th>
                                    <th>{t('photo')}</th>
                                    <th>{t('aadhar_card')}</th>
                                    <th>{t('signature')}</th>
                                    <th>{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                { sureties.map((s, index) =>(
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td>{ s.surety_name }</td>
                                    <td>{ s.relative_name }</td>
                                    <td>{ s.aadhar_number }</td>
                                    <td>
                                        <a href={`${config.docUrl}${s.photo}`} target="_blank">View</a>
                                    </td>
                                    <td>
                                        <a href={`${config.docUrl}${s.aadhar_card}`} target="_blank">View</a>
                                    </td>
                                    <td>
                                        <a href={`${config.docUrl}${s.signature}`} target="_blank">View</a>
                                    </td>
                                    <td>
                                        <Button
                                            variant='contained'
                                            color='info'
                                            size='small'
                                        >Edit</Button>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            size='small'
                                            className='ml-2'
                                            onClick={(e) => deleteSurety(s)}
                                        >Delete</Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>{t('surety_name')}<RequiredField /></label>
                            <input 
                                type="text" 
                                name="surety_name" 
                                value={surety.surety_name} 
                                // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                onChange={(e) => handleNameChange(e, setSurety, surety, 'surety_name')}
                                className={`form-control ${errors.surety_name ? 'is-invalid' : null }`}
                            />
                            <div className="invalid-feedback">
                                { errors.surety_name }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('relationship_type')} <RequiredField/></label>
                            <select 
                                name="relation" 
                                className={`form-control ${errors.relation ? 'is-invalid' : null }`}
                                value={surety.relation}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select parentage</option>
                                { relations.map((relation, index) => (
                                <option key={index} value={relation.id}>{relation.relation_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.relation }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('relationship_name')} <RequiredField/></label>
                            <input 
                                type="text" 
                                name="relative_name" 
                                value={surety.relative_name} 
                                // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                onChange={(e) => handleNameChange(e, setSurety, surety, 'relative_name')}
                                className={`form-control ${errors.relative_name ? 'is-invalid' : null }`}
                            />
                            <div className="invalid-feedback">
                                { errors.relative_name }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('aadhar_number')}<RequiredField /></label>
                            <input 
                                type="text" 
                                name="aadhar_number" 
                                value={surety.aadhar_number} 
                                // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                onChange={(e) => handleAadharChange(e, setSurety, surety, 'aadhar_number')}
                                className={`form-control ${errors.aadhar_number ? 'is-invalid' : null}`}
                            />
                            <div className="invalid-feedback">
                                { errors.aadhar_number }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('state')}<RequiredField /></label>
                            <select 
                                name="state" 
                                className={`form-control ${errors.state ? 'is-invalid' : null }`}
                                value={surety.state}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select state</option>
                                { states.map((state, index) => (
                                <option key={index} value={state.state_code}>{state.state_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.state }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('district')}<RequiredField/></label>
                            <select 
                                name="district"
                                className={`form-control ${errors.district ? 'is-invalid' : null }`}
                                value={surety.district}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select district</option>
                                { districts.filter(d=>parseInt(d.state)===parseInt(surety.state)).map((district, index) => (
                                <option value={district.district_code} key={index}>{district.district_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.district }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('taluk')}<RequiredField/></label>
                            <select 
                                name="taluk"
                                className={`form-control ${errors.taluk ? 'is-invalid' : null }`}
                                value={surety.taluk}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select taluk</option>
                                { taluks.filter(t=>parseInt(t.district)===parseInt(surety.district)).map((taluk, index) => (
                                <option value={taluk.id} key={index}>{taluk.taluk_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.taluk }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>{t('address')}<RequiredField/></label>
                            <input 
                                type="text" 
                                name="address" 
                                value={surety.address} 
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                className={`form-control ${errors.address ? 'is-invalid' : null }`}
                            />
                            <div className="invalid-feedback">
                                { errors.address}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('pincode')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="pincode"
                                className={`form-control ${errors.pincode ? 'is-invalid' :  null}`}
                                value={surety.pincode}
                                // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                onChange={(e) => handlePincodeChange(e, setSurety, surety, 'pincode')}
                            />
                            <div className="invalid-feedback">
                                { errors.pincode }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('mobile_number')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="mobile_number"
                                className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
                                value={surety.mobile_number}
                                onChange={(e) => handleMobileChange(e, setSurety, surety, 'mobile_number')}
                            />
                            <div className="invalid-feedback">
                                { errors.mobile_number }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('email_address')}</label>
                            <input 
                                type="text"
                                name="email_address"
                                className={`form-control ${errors.email_address ? 'is-invalid' : ''}`}
                                value={surety.email_address}
                                // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                onChange={handleChange}
                            />
                            {errors.email_address && <div className="invalid-feedback">{errors.email_address}</div>}
                        </div>
                        
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('residing_since')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="residing_years"
                                className={`form-control ${errors.residing_years ? 'is-invalid' : null}`}
                                value={surety.residing_years}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.residing_years}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('property_type')}<RequiredField/></label>
                            <select 
                                name="property_type" 
                                value={surety.property_type} 
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className={`form-control ${errors.property_type ? 'is-invalid' : null}`}
                            >
                                <option value="">Select type</option>
                                <option value="1">Own</option>
                                <option value="2">Rental</option>
                            </select>
                            <div className="invalid-feedback">
                                { errors.property_type }
                            </div>
                        </div>
                    </div>
                    { parseInt(surety.property_type) === 1 && (
                    <>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('survey_number')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="survey_number"
                                value={surety.survey_number}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                className="form-control" 
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('location')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="site_location"
                                value={surety.site_location}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}  
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('area')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="site_area"
                                value={surety.site_area}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className="form-control"  
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">{t('valuation')}<RequiredField/></label>
                            <input 
                                type="number"
                                name="site_valuation"
                                value={surety.site_valuation}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className="form-control"  
                            />
                        </div>
                    </div>
                    </>   
                    )}
                    { parseInt(surety.property_type) === 2 && (
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('rent_bill')}<RequiredField/></label><br />
                            <div>
                                <div className="icheck-success d-inline mx-2">
                                <input 
                                    type="radio" 
                                    name="rent_bill_surety_name" 
                                    id="isRentBillYes" 
                                    value={surety.rent_bill_surety_name}
                                    checked={ surety.rent_bill_surety_name }
                                    onChange={(e) => setSurety({...surety, rent_bill_surety_name: true})} 
                                />
                                <label htmlFor="isRentBillYes">{t('yes')}</label>
                                </div>
                                <div className="icheck-danger d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="isRentBillNo" 
                                    name="rent_bill_surety_name" 
                                    value={surety.rent_bill_surety_name}
                                    checked={ !surety.rent_bill_surety_name } 
                                    onChange={(e) => setSurety({...surety, rent_bill_surety_name: false})}
                                />
                                <label htmlFor="isRentBillNo">{t('no')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="">{parseInt(surety.property_type) === 1 ? t('patta_chitta') : t('rental_agreement')}<RequiredField/></label>
                            <input 
                                type="file" 
                                className="form-control" 
                                name="property_document"
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                            />
                        </div>
                    </div>
                
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('occupation')}<RequiredField/></label>
                            <select 
                                name="employment_type" 
                                value={ surety.employment_type } 
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className={`form-control ${errors.employment_type ? 'is-invalid' : null }`}
                            >
                                <option value="">Select type</option>
                                <option value="1">Employed</option>
                                <option value="2">Self Employed</option>
                                <option value="3">Business</option>
                                <option value="4">Agriculture</option>
                                <option value="5">Unemployed</option>
                            </select>
                            <div className="invalid-feedback">
                                { errors.employment_type }
                            </div>
                        </div>
                    </div>
                </div>
                { parseInt(surety.employment_type) === 1 && (
                <div className="card">
                    <div className="card-header bg-navy">
                        <strong>{t('employment_details')}</strong>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('employer_name')}<RequiredField/></label>
                                    <input type="text" 
                                        name="employer_name" 
                                        value={surety.employer_name} 
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        onChange={(e) => handleNameChange(e, setSurety, surety, 'employer_name')}
                                        className={`form-control ${errors.employer_name ? 'is-invalid' : null }`}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('designation')}<RequiredField/></label>
                                    <input type="text" 
                                        name="designation" 
                                        value={surety.designation} 
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        onChange={(e) => handleNameChange(e, setSurety, surety, 'designation')}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="">{t('state')}<RequiredField/></label>
                                    <select 
                                        name="employer_state" 
                                        className="form-control"
                                        value={surety.employer_state}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select state</option>
                                        { states.map((state, index) => (
                                        <option value={state.state_code} key={index}>{state.state_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('district')}<RequiredField/></label>
                                    <select 
                                        name="employer_district"
                                        className="form-control"
                                        value={surety.employer_district}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter(d=>parseInt(d.state) === parseInt(surety.employer_state)).map((district, index) => (
                                        <option value={district.district_code} key={index}>{district.district_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('taluk')}<RequiredField/></label>
                                    <select 
                                        name="employer_taluk"
                                        className="form-control"
                                        value={surety.employer_taluk}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select taluk</option>
                                        { taluks.filter(t=>parseInt(t.district)===parseInt(surety.employer_district)).map((taluk, index) => (
                                        <option value={taluk.id} key={index}>{ taluk.taluk_name }</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('employer_address')}<RequiredField/></label>
                                    <input type="text" 
                                        name="employer_address" 
                                        value={surety.employer_address} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('service_years')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="service_length" 
                                        value={surety.service_length} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('pf_amount')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="pf_amount" 
                                        value={surety.pf_amount} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                        className="form-control" 
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('house_property_details')}<RequiredField/></label>
                                    <textarea 
                                        name="property_details" 
                                        value={surety.property_details} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className='form-control'
                                        rows={1}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('income_tax_paid')}<RequiredField/></label>
                                    <input 
                                        type="number"
                                        name="income_tax_paid" 
                                        value={surety.income_tax_paid} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="">{t('upload_document')}<RequiredField/></label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    name="employment_document"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                )}
                { parseInt(surety.employment_type) === 2 && (
                <div className="card">
                    <div className="card-header bg-navy">
                        <strong>Business Details</strong>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="">{t('state')}<RequiredField/></label>
                                    <select 
                                        name="business_state" 
                                        className="form-control"
                                        value={surety.business_state}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select state</option>
                                        { states.map((state, index) => (
                                        <option value={state.state_code} key={index}>{ state.state_name }</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('district')}<RequiredField/></label>
                                    <select 
                                        name="business_district"
                                        className="form-control"
                                        value={surety.business_district}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter(d=>parseInt(d.state)===parseInt(surety.business_state)).map((district, index) => (
                                        <option value={district.district_code} key={index}>{district.district_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('taluk')}<RequiredField/></label>
                                    <select 
                                        name="business_taluk"
                                        className="form-control"
                                        value={surety.business_taluk}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select taluk</option>
                                        { taluks.filter(t=>parseInt(t.district)===parseInt(surety.business_district)).map((taluk, index) => (
                                        <option value={taluk.id} key={index}>{ taluk.taluk_name }</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('business_address')}<RequiredField/></label>
                                    <input 
                                        type="text" 
                                        name="business_address" 
                                        value={surety.business_address} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className='form-control'
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('business_nature')}<RequiredField/></label>
                                    <input 
                                        type="text" 
                                        name="business_nature" 
                                        value={surety.business_nature} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('rent_paid')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="business_rent_paid" 
                                        value={surety.business_rent_paid} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('rent_bill_name')}<RequiredField/></label>
                                    <div>
                                        <div className="icheck-success d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            name="is_rent_bill_name" 
                                            id="isRentBillYes" 
                                            value={ surety.is_rent_bill_name }
                                            checked={ surety.is_rent_bill_name }
                                            onChange={(e) => setSurety({...surety, is_rent_bill_name: true})} 
                                        />
                                        <label htmlFor="isRentBillYes">{t('yes')}</label>
                                        </div>
                                        <div className="icheck-danger d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="isRentBillNo" 
                                            name="is_rent_bill_name" 
                                            value={surety.is_rent_bill_name}
                                            checked={ !surety.is_rent_bill_name } 
                                            onChange={(e) => setSurety({...surety, is_rent_bill_name: false})}
                                        />
                                        <label htmlFor="isRentBillNo">{t('no')}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="">{t('upload_document')}<RequiredField/></label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    name="business_document"
                                    onChange={(e)=> setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                )}
                <div className="card">
                    <div className="card-header bg-navy">
                        <strong>{t('bank_details')}</strong>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                { Object.keys(bankAccounts).length > 0 && (
                                <table className="table table striped table-bordered table-sm">
                                    <thead className='bg-secondary'>
                                        <tr>
                                            <th>#</th>
                                            <th>{t('bank_name')}</th>
                                            <th>{t('branch_name')}</th>
                                            <th>{t('account_number')}</th>
                                            <th>{t('ifsc_code')}</th>
                                            <th>{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { bankAccounts.map((b, index) => (
                                        <tr>
                                            <td>{ index+1} </td>
                                            <td>{ b.bank_name }</td>
                                            <td>{ b.branch_name }</td>
                                            <td>{ b.account_number }</td>
                                            <td>{ b.ifsc_code }</td>
                                            <td>
                                                <Button
                                                    variant='contained'
                                                    color='info'
                                                    size='small'
                                                >{t('edit')}</Button>
                                                <Button
                                                    variant='contained'
                                                    color='error'
                                                    className="ml-1"
                                                    size='small'
                                                >{t('delete')}</Button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                )}
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">{t('bank_name')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="bank_name"
                                                value={account.bank_name}
                                                // onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                onChange={(e) => handleNameChange(e, setAccount, account, 'bank_name')}
                                                className="form-control"
                                            />
                                        </div>
                                    </div> 
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">{t('branch_name')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="branch_name"
                                                value={account.branch_name}
                                                // onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                onChange={(e) => handleNameChange(e, setAccount, account, 'branch_name')}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="">{t('account_number')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="account_number"
                                                value={account.account_number}
                                                // onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                onChange={(e) => handleNameChange(e, setAccount, account, 'account_number')}
                                                className="form-control"
                                            />
                                        </div>
                                    </div> 
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="">{t('ifsc_code')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="ifsc_code"
                                                value={account.ifsc_code}
                                                // onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                onChange={(e) => handleNameChange(e, setAccount, account, 'ifsc_code')}
                                                className="form-control"
                                            />
                                        </div>
                                    </div> 
                                    <div className="col-md-2 mt-4 pt-2">
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={addBankAccount}
                                        >{t('add')}</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('acquaintance_duration')}<RequiredField/></label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <input
                                                type="text"
                                                name="accused_duration_year"
                                                placeholder="Years"
                                                value={surety.accused_duration_year}
                                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                                className={`form-control ${errors.accused_duration_year ? 'is-invalid' : null}`}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.accused_duration_year }
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            name="accused_duration_month"
                                            placeholder="Months"
                                            value={surety.accused_duration_month}
                                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                            className={`form-control ${errors.accused_duration_month ? 'is-invalid' : null }`}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.accused_duration_month }
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('related_to_accused')}<RequiredField/></label>
                                    <div>
                                        <div className="icheck-success d-inline mx-2 mt-1">
                                            <input 
                                                type="radio" 
                                                name="is_related" 
                                                id="isRelatedYes" 
                                                value={surety.is_related}
                                                checked={ surety.is_related }
                                                onChange={(e) => setSurety({...surety, is_related: true})} 
                                            />
                                            <label htmlFor="isRelatedYes">{t('yes')}</label>
                                        </div>
                                        <div className="icheck-danger d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                id="isRelatedNo" 
                                                name="is_related" 
                                                value={surety.is_related}
                                                checked={ !surety.is_related } 
                                                onChange={(e) => setSurety({...surety, is_related: false})}
                                            />
                                            <label htmlFor="isRelatedNo">{t('no')}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('relation_details')}<RequiredField/></label>
                                    <input 
                                        type="text" 
                                        name="relation_details" 
                                        value={surety.relation_details} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.relation_details ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.relation_details }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label>{t('any_other_cases')}<RequiredField/></label>
                                    <textarea 
                                        name="others_surety" 
                                        value={surety.others_surety} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.others_surety ? 'is-invalid' : null }`}
                                        rows={1}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.others_surety }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label>{t('litigation_details')}<RequiredField/></label>
                                    <textarea 
                                        name="litigation_details" 
                                        value={surety.litigation_details} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.litigation_details ? 'is-invalid' : null }`}
                                        rows={1}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.litigation_details }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label>{t('other_particulars')}<RequiredField/></label>
                                    <textarea 
                                        name="other_particulars" 
                                        value={surety.other_particulars} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.other_particulars ? 'is-invalid' : null }`}
                                        rows={1}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.other_particulars }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>{t('surety_amount')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="surety_amount" 
                                        value={surety.surety_amount} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.surety_amount ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.surety_amount }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('upload_photo')}<RequiredField /></label>
                                    <input 
                                        type="file" 
                                        name="photo"
                                        className={`form-control ${errors.photo ? 'is-invalid' : null }`}
                                        onChange={(e) => handleFileChange(e, 'photo')}
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.photo }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('upload_signature')}<RequiredField/></label>
                                    <input 
                                        type="file" 
                                        name="signature"
                                        className={`form-control ${errors.signature ? 'is-invalid' : null }`}
                                        onChange={(e) => handleFileChange(e, 'signature')}
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.signature }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('upload_aadhar')}<RequiredField /></label>
                                    <input 
                                        type="file" 
                                        name="aadhar_card"
                                        className={`form-control ${errors.aadhar_card ? 'is-invalid' : null }`}
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                        onChange={(e) => handleFileChange(e, 'aadhar_card')}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.aadhar_card }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('upload_identity_proof')}</label>
                                    <input 
                                        type="file" 
                                        name="identity_proof"
                                        className={`form-control ${errors.identity_proof ? 'is-invalid' : null }`}
                                        // onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                        onChange={(e) => handleFileChange(e, 'identity_proof')}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.identity_proof }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select document</label>
                                    <select 
                                        name="doucment" 
                                        className="form-control"
                                    >
                                        <option value="">Select document</option>
                                        <option value="photo">Photo</option>
                                        <option value="signature">Signature</option>
                                        <option value="aadhar_card">Aaadhar Card</option>
                                        <option value="identity_proof">Identity Proof</option>
                                    </select>
                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-md-12 d-flex justify-content-center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type='submit'
                                    onClick={handleSubmit}
                                >{t('save')}</Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    className="ml-2"
                                >{t('reset')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        variant='contained'
                        color='info'
                    
                        endIcon={<ArrowForward />}
                    >{t('next')}</Button>
                </div>
            {/* </form> */}
        </div>
    )
}

export default SuretyForm