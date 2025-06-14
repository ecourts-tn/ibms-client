import React, {useState, useEffect, useContext} from 'react'
import { RequiredField } from 'utils'
import api from 'api'
import {toast,ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ViewSurety from './ViewSurety'
import { MasterContext } from 'contexts/MasterContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { BaseContext } from 'contexts/BaseContext'
import BootstrapButton from 'react-bootstrap/Button'
import { ModelClose } from 'utils'


const SuretyForm = () => {
    const FILE_SIZE = 10 *1024 * 1024
    const IMAGE_SIZE = 3 * 1024 *1024
    const SUPPORTED_FILES = ['application/pdf']
    const SUPPORTED_IMAGES = ['image/jpeg','image/png','image/gif']
    const {language} = useContext(LanguageContext)
    const { masters: {
        states, 
        districts, 
        taluks, 
        relations,
        employments,
        propertytypes
    }} = useContext(MasterContext)
    const {t} = useTranslation()
    const { efileNumber } = useContext(BaseContext)
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
        photo: '',
        signature:'',
        identity_proof:'',
        aadhar_card: ''
    }
    const[surety, setSurety] = useState(initialState);
    const [show, setShow] = useState(false);
    const[sureties, setSureties] = useState([])
    const[selectedSurety, setSelectedSurety] = useState(null);
    const[suretyCount, setSuretyCount] = useState(0)
    const[petitions, setPetitions] = useState([])
    const initialAccount = {
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: ''
    }
    const[account, setAccount] = useState(initialAccount)
    const[bankAccounts, setBankAccounts] = useState([])
    const[errors, setErrors] = useState({})
    const[showModal, setShowModal] = useState(false);

    const handlePreviousClose = () => {
        setShow(false);
    }

    const handleShow = (surety) => {
        setSelectedSurety(surety);  // Set selected surety details
        setShowModal(true);         // Show the modal
    };
    
    const handleClose = () => {
        setShowModal(false);        // Close the modal
    };

    const validationSchema = Yup.object({
        surety_name: Yup.string().required(),
        relation: Yup.string().required(),
        relative_name: Yup.string().required(),
        aadhar_number: Yup.string()
            .required('Aadhar number is required')
            .matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),
        state: Yup.string().required(),
        district: Yup.string().required(),
        taluk: Yup.string().required(),
        address: Yup.string().required(),
        pincode: Yup.string()
            .required('Pincode is required')
            .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
        mobile_number: Yup.string()
            .required('Mobile number is required')
            .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
        residing_years: Yup.string()
            .required('Residing years is required')
            .matches(/^\d{1,2}$/, 'Value must less than 2 digits'),
        property_type: Yup.string().required(),
        survey_number: Yup.string()
            .nullable()
            .when('property_type', (property_type, schema) => {
                if (parseInt(property_type) === 1) {
                  return schema.required('Survey number is required');
                }
                return schema.notRequired();
            }),
        site_location: Yup.string()
            .nullable()
            .when('property_type', (property_type, schema) => {
                if (parseInt(property_type) === 1) {
                  return schema.required('Location is required');
                }
                return schema.notRequired();
            }),
        site_area: Yup.string()
            .nullable()
            .when('property_type', (property_type, schema) => {
                if (parseInt(property_type) === 1) {
                  return schema.required('Area is required');
                }
                return schema.notRequired();
            }),
        site_valuation: Yup.string()
            .nullable()
            .when('property_type', (property_type, schema) => {
                if (parseInt(property_type) === 1) {
                  return schema.required('Valuation is required');
                }
                return schema.notRequired();
            }),
        property_document: Yup.mixed()
            .nullable()
            .when('property_type', (property_type, schema) => {
                if (parseInt(property_type) === 1) {
                    return schema
                        .required('Document is required')
                        .test('fileSize', 'File too large (max 10MB)', value =>
                            value ? value.size <= FILE_SIZE : false
                        )
                        .test('fileType', 'Unsupported file format', value =>
                            value ? SUPPORTED_FILES.includes(value.type) : false
                        );
                }
                return schema.notRequired();
            }),
        employment_type: Yup.string().required('employment_type is required'),
        employer_name: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Employer name is required');
                }
                return schema.notRequired();
            }),
        designation: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Designation is required');
                }
                return schema.notRequired();
            }),
        employer_address: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Address is required');
                }
                return schema.notRequired();
            }),
        employer_state: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required(t('errors.state_required'));
                }
                return schema.notRequired();
            }),
        employer_district: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required(t('errors.district_required'));
                }
                return schema.notRequired();
            }),
        employer_taluk: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required(t('errors.taluk_required'));
                }
                return schema.notRequired();
            }),
        service_length: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Service length is required');
                }
                return schema.notRequired();
            }),
        pf_amount: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('PF Amount is required');
                }
                return schema.notRequired();
            }),
        property_details: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Property details required');
                }
                return schema.notRequired();
            }),
        income_tax_paid: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('this field is required');
                }
                return schema.notRequired();
            }),
        employment_document: Yup.mixed()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                    return schema
                        .required('Document is required')
                        .test('fileSize', 'File too large (max 10MB)', value =>
                            value ? value.size <= FILE_SIZE : false
                        )
                        .test('fileType', 'Unsupported file format', value =>
                            value ? SUPPORTED_FILES.includes(value.type) : false
                        );
                }
                return schema.notRequired();
            }),
        business_address: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 1) {
                  return schema.required('Address is required');
                }
                return schema.notRequired();
            }),
        business_state: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required(t('errors.state_required'));
                }
                return schema.notRequired();
            }),
        business_district: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required(t('errors.district_required'));
                }
                return schema.notRequired();
            }),
        business_taluk: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required(t('errors.taluk_required'));
                }
                return schema.notRequired();
            }),
        business_nature: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required('Business nature is required');
                }
                return schema.notRequired();
            }),
        business_rent_paid: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required('This field is required');
                }
                return schema.notRequired();
            }),
        is_rent_bill_name: Yup.string()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema.required('This field is required');
                }
                return schema.notRequired();
            }),
        business_document: Yup.mixed()
            .nullable()
            .when('employment_type', (employment_type, schema) => {
                if (parseInt(employment_type) === 3) {
                  return schema
                    .required('Document is required')
                    .test('fileSize', 'File too large (max 10MB)', value =>
                        value ? value.size <= FILE_SIZE : false
                    )
                    .test('fileType', 'Unsupported file format', value =>
                        value ? SUPPORTED_FILES.includes(value.type) : false
                    );
                }
                return schema.notRequired();
            }),
        accused_duration_year: Yup.number().required().typeError("This field should be numeric"),
        accused_duration_month: Yup.number().required().typeError("This field should be numeric"),
        is_related: Yup.boolean().required(),
        relation_details: Yup.string().required(),
        others_surety:Yup.string().required(),
        litigation_details: Yup.string().required(),
        other_particulars: Yup.string().required(),
        surety_amount: Yup.number().required().typeError("Amount should be numeric"),
        photo: Yup.mixed()
            .required('Photo is required')
            .test('fileSize', 'File size to too large (Max 3MB)', (value) => value && value.size <= IMAGE_SIZE)
            .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGES.includes(value.type)),
        signature: Yup.mixed()
            .required('Signature is required')
            .test('fileSize', 'File size to too large (Max 3MB)', (value) => value && value.size <= IMAGE_SIZE)
            .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGES.includes(value.type)),
        identity_proof: Yup.mixed()
            .required('Identity proof is required')
            .test('fileSize', 'File size to too large (Max 3MB)', (value) => value && value.size <= IMAGE_SIZE)
            .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGES.includes(value.type)),
        aadhar_card: Yup.mixed()
            .required('Aadhar card is required')
            .test('fileSize', 'File size to too large (Max 3MB)', (value) => value && value.size <= IMAGE_SIZE)
            .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGES.includes(value.type)),
    })

    useEffect(()=> {
        const fecthSureties = async() => {
            try{
                const response = await api.get("case/surety/list/", {
                    params: {efile_no: efileNumber}
                })
                if(response.status === 200){
                    setSureties(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fecthSureties();
    }, [])

    const deleteSurety = async (surety) => {
        try {
            // Show confirmation before deleting
            const confirmDelete = window.confirm(`Are you sure you want to delete surety with ID: ${surety.surety_id}?`);
            if (!confirmDelete) return; // If the user cancels, exit the function
    
            // Send delete request
            const response = await api.delete("case/surety/delete/", {
                params: { id: surety.surety_id }
            });
    
            // If the delete was successful
            if (response.status === 204) {
                // Remove the deleted surety from the list
                const newSureties = sureties.filter((s) => s.surety_id !== surety.surety_id);
    
                // Show a success message
                toast.success(`Surety deleted successfully`, {
                    theme: "colored"
                });
    
                // Update the sureties state with the new list
                setSureties(newSureties);
            }
        } catch (error) {
            // Handle error during deletion
            console.error(error);
            toast.error("An error occurred while deleting the surety. Please try again.", {
                theme: "colored"
            });
        }
    };
    

    const handlePreviousSurety = async() => {
        try{
            const response = await api.post('case/surety/history/', {aadhar: surety.aadhar_number})
            if(response.status === 200){
                setShow(true)
                setSuretyCount(response.data.aadhaar_count)
                setPetitions(response.data.petitions)
            }
        }catch(error){
            console.log(error)
        }
    }


    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(surety, {abortEarly:false})
            // const formData = new FormData();

            // // Add all non-file fields to FormData
            // for (const key in surety) {
            //     if (surety[key] && typeof surety[key] !== "object") {
            //         formData.append(key, surety[key]);
            //     }
            // }
        
            // // Add file fields to FormData
            // if (surety.photo) formData.append("photo", surety.photo);
            // if (surety.signature) formData.append("signature", surety.signature);
            // if (surety.identity_proof) formData.append("identity_proof", surety.identity_proof);
            // if (surety.aadhar_card) formData.append("aadhar_card", surety.aadhar_card);
        
            // Add efile_no separately if it's in sessionStorage
            const efile_no = sessionStorage.getItem("efile_no");
            // if (efile_no) formData.append("efile_no", efile_no);
            surety.efile_no = efile_no
            const response = await api.post("case/surety/create/", surety, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if(response.status === 201){
                toast.success("Surety Details added successfully", {theme:"colored"})
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
    
    return (
        <div className="container-fluid">
             <Modal 
                show={showModal} 
                onHide={handleClose} 
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title><strong>{t('surety_details')}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewSurety surety={selectedSurety}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                    {t('close')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal 
                show={show} 
                onHide={handlePreviousClose} 
                backdrop="static"
                keyboard={false}
                size="xl"
            >
            <Modal.Header className="bg-success">
                <Modal.Title style={{ fontSize:'18px'}}><strong>Previous Surety Details</strong></Modal.Title>
                <ModelClose handleClose={handlePreviousClose}/>
            </Modal.Header>
            <Modal.Body>
                <p>The Aadhaar number <strong>{surety.aadhar_number}</strong> has already been provided for {suretyCount} sureties.</p>
                <table className="table table-bordered table-striped table-sm">
                    <thead className="bg-info">
                        <tr>
                            <th>#</th>
                            <th>Case Number</th>
                            <th>Litigants</th>
                            <th>Court</th>
                        </tr>
                    </thead>
                    <tbody>
                        { petitions.map((p, index) => (
                        <tr>
                            <td>{index+1}</td>
                            <td>{`${p.case_type.type_name}/${p.reg_number}/${p.reg_year}`}</td>
                            <td>{`${p.pet_name } Vs ${p.res_name}`}</td>
                            <td>
                                <React.Fragment>
                                    { p.court?.court_name } <br />
                                    { p.district?.district_name }
                                </React.Fragment>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <BootstrapButton 
                    variant="secondary" 
                    onClick={handlePreviousClose}
                    className="btn-sm"
                >
                    Close
                </BootstrapButton>
            </Modal.Footer>
        </Modal>
            <form onSubmit={handleSubmit} encType='multipart/form-data' method='POST'>
                <ToastContainer />
                <div className="row mt-3">
                    <div className="col-md-12">
                        { Object.keys(sureties).length > 0 && (
                        <table className="table table-bordered">
                            <thead className="bg-info">
                                <tr>
                                    <th>#</th>
                                    <th>{t('surety_name')}</th>
                                    <th>{t('relationship_name')}</th>
                                    <th>{t('aadhar_number')}</th>
                                    <th>{t('mobile_number')}</th>
                                    <th>{t('address')}</th>
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
                                    <td>{ s.mobile_number }</td>
                                    <td>{ s.address }</td>
                                    <td>
                                        <Button
                                            variant='contained'
                                            color='warning'
                                            size='small'
                                            className="mr-1"
                                            onClick={() => handleShow(s)}
                                        >View</Button>
                                        <Button
                                            variant='contained'
                                            color='info'
                                            size='small'
                                        >Edit</Button>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            size='small'
                                            className='ml-1'
                                            onClick={(e) => deleteSurety(s)}
                                        >Delete</Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>{t('surety_name')}<RequiredField /></label>
                            <input 
                                type="text" 
                                name="surety_name" 
                                value={surety.surety_name} 
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className={`form-control ${errors.surety_name ? 'is-invalid' : null }`}
                            />
                            <div className="invalid-feedback">
                                { errors.surety_name }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('relationship_type')} <RequiredField/></label>
                            <select 
                                name="relation" 
                                className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                                value={surety.relation}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">{t('alerts.select_parantage')}</option>
                                { relations.map((item, index) => (
                                    <option key={index} value={item.id}>{ language === 'ta' ? item.relation_lname : item.relation_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.relation }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('relationship_name')} <RequiredField/></label>
                            <input 
                                type="text" 
                                name="relative_name" 
                                value={surety.relative_name} 
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                className={`form-control ${errors.relative_name ? 'is-invalid' : null }`}
                            />
                            <div className="invalid-feedback">{ errors.relative_name }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>{t('aadhar_number')}<RequiredField /></label>
                            <input 
                                type="text" 
                                name="aadhar_number" 
                                value={surety.aadhar_number} 
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 12){
                                        setSurety({...surety, [e.target.name]: value})
                                    } 
                                }}
                                onBlur={handlePreviousSurety}
                                className={`form-control ${errors.aadhar_number ? 'is-invalid' : null}`}
                            />
                            <div className="invalid-feedback">{ errors.aadhar_number }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('state')}<RequiredField /></label>
                            <select 
                                name="state" 
                                className={`form-control ${errors.state ? 'is-invalid' : null }`}
                                value={surety.state}
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            >
                                <option value="">{t('alerts.select_state')}</option>
                                { states.map((item, index) => (
                                <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.state }</div>
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
                                <option value="">{t('alerts.select_district')}</option>
                                { districts.filter(district=>parseInt(district.state)===parseInt(surety.state)).map((item, index) => (
                                <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.district }</div>
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
                                <option value="">{t('alerts.select_taluk')}</option>
                                { taluks.filter(taluk=>parseInt(taluk.district)===parseInt(surety.district)).map((item, index) => (
                                <option value={item.taluk_code} key={index}>{ language === 'ta' ? item.taluk_lname : item.taluk_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.taluk }</div>
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
                            <div className="invalid-feedback">{ errors.address}</div>
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
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 6){
                                        setSurety({...surety, [e.target.name]: value})
                                    }
                                }}
                            />
                            <div className="invalid-feedback">{ errors.pincode }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">{t('mobile_number')}<RequiredField/></label>
                            <input 
                                type="text"
                                name="mobile_number"
                                className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
                                value={surety.mobile_number}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 10){
                                        setSurety({...surety, [e.target.name]: value})
                                    }
                                }}
                            />
                            <div className="invalid-feedback">{ errors.mobile_number }</div>
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
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">{errors.email_address}</div>
                        </div>
                    </div>
                    <div className="col-md-3">
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
                                {propertytypes.map((p, index) => (
                                <option key={index} value={p.id}>{language === 'ta' ? p.type_lname : p.type_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.property_type }</div>
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
                                className={`form-control ${errors.survey_number ? 'is-invalid' : null}`}
                            />
                            <div className="invalid-feedback">{ errors.survey_number }</div>
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
                                className={`form-control ${errors.site_location ? 'is-invalid' : null}`}
                            />
                            <div className="invalid-feedback">{ errors.site_location }</div>
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
                                className={`form-control ${errors.site_area ? 'is-invalid' : null}`}  
                            />
                            <div className="invalid-feedback">{ errors.site_area }</div>
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
                                className={`form-control ${errors.site_valuation ? 'is-invalid' : null}`} 
                            />
                            <div className="invalid-feedback">{ errors.site_valuation }</div>
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
                                className={`form-control ${errors.property_document ? 'is-invalid' : null}`} 
                                name="property_document"
                                onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                            />
                            <div className="invalid-feedback">{ errors.property_document }</div>
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
                                { employments.map((e, index) => (
                                <option key={index} value={e.id}>{language === 'ta' ? e.type_lname : e.type_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.employment_type }</div>
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
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.employer_name ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.employer_name }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('designation')}<RequiredField/></label>
                                    <input type="text" 
                                        name="designation" 
                                        value={surety.designation} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.designation ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.designation }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('state')}<RequiredField/></label>
                                    <select 
                                        name="employer_state" 
                                        className={`form-control ${errors.employer_state ? 'is-invalid' : null }`}
                                        value={surety.employer_state}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select state</option>
                                        { states.map((state, index) => (
                                        <option value={state.state_code} key={index}>{state.state_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.employer_state }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('district')}<RequiredField/></label>
                                    <select 
                                        name="employer_district"
                                        className={`form-control ${errors.employer_district ? 'is-invalid' : null }`}
                                        value={surety.employer_district}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter(d=>parseInt(d.state) === parseInt(surety.employer_state)).map((district, index) => (
                                        <option value={district.district_code} key={index}>{district.district_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.employer_district }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('taluk')}<RequiredField/></label>
                                    <select 
                                        name="employer_taluk"
                                        className={`form-control ${errors.employer_taluk ? 'is-invalid' : null }`}
                                        value={surety.employer_taluk}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select taluk</option>
                                        { taluks.filter(t=>parseInt(t.district)===parseInt(surety.employer_district)).map((taluk, index) => (
                                        <option value={taluk.id} key={index}>{ taluk.taluk_name }</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.employer_taluk }</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('employer_address')}<RequiredField/></label>
                                    <input type="text" 
                                        name="employer_address" 
                                        value={surety.employer_address} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.employer_address ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.employer_address }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('service_years')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="service_length" 
                                        value={surety.service_length} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.service_years ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.service_years }</div>
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
                                        className={`form-control ${errors.pf_amount ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.pf_amount }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>{t('house_property_details')}<RequiredField/></label>
                                    <textarea 
                                        name="property_details" 
                                        value={surety.property_details} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.property_details ? 'is-invalid' : null }`}
                                        rows={1}
                                    />
                                    <div className="invalid-feedback">{ errors.property_details }</div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label>{t('income_tax_paid')}<RequiredField/></label>
                                    <input 
                                        type="number"
                                        name="income_tax_paid" 
                                        value={surety.income_tax_paid} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.income_tax_paid ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.income_tax_paid }</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="">{t('upload_document')}<RequiredField/></label>
                                <input 
                                    type="file" 
                                    name="employment_document"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                    className={`form-control ${errors.employment_document ? 'is-invalid' : null }`}
                                />
                                <div className="invalid-feedback">{ errors.employment_document }</div>
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
                                        className={`form-control ${errors.business_state ? 'is-invalid' : null }`}
                                        value={surety.business_state}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select state</option>
                                        { states.map((state, index) => (
                                        <option value={state.state_code} key={index}>{ state.state_name }</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.business_state }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('district')}<RequiredField/></label>
                                    <select 
                                        name="business_district"
                                        className={`form-control ${errors.business_district ? 'is-invalid' : null }`}
                                        value={surety.business_district}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter(d=>parseInt(d.state)===parseInt(surety.business_state)).map((district, index) => (
                                        <option value={district.district_code} key={index}>{district.district_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.business_district }</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">{t('taluk')}<RequiredField/></label>
                                    <select 
                                        name="business_taluk"
                                        className={`form-control ${errors.business_taluk ? 'is-invalid' : null }`}
                                        value={surety.business_taluk}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select taluk</option>
                                        { taluks.filter(t=>parseInt(t.district)===parseInt(surety.business_district)).map((taluk, index) => (
                                        <option value={taluk.id} key={index}>{ taluk.taluk_name }</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{ errors.business_taluk }</div>
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
                                        className={`form-control ${errors.business_address ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.business_address }</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('business_nature')}<RequiredField/></label>
                                    <input 
                                        type="text" 
                                        name="business_nature" 
                                        value={surety.business_nature} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.business_nature ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.business_nature }</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>{t('rent_paid')}<RequiredField/></label>
                                    <input 
                                        type="number" 
                                        name="business_rent_paid" 
                                        value={surety.business_rent_paid} 
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                        className={`form-control ${errors.business_rent_paid ? 'is-invalid' : null }`}
                                    />
                                    <div className="invalid-feedback">{ errors.business_rent_paid }</div>
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
                                    name="business_document"
                                    onChange={(e)=> setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                    className={`form-control ${errors.business_document ? 'is-invalid' : null }`}
                                />
                                <div className="invalid-feedback">{ errors.business_document }</div>
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
                                                onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
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
                                                onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">{t('account_number')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="account_number"
                                                value={account.account_number}
                                                onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div> 
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">{t('ifsc_code')}<RequiredField/></label>
                                            <input
                                                type="text"
                                                name="ifsc_code"
                                                value={account.ifsc_code}
                                                onChange={(e) => setAccount({...account, [e.target.name]: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div> 
                                    <div className="col-md-2">
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
                {/* <div className="card">
                    <div className="card-body"> */}
                        <div className="row">
                            <div className="col-md-4">
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
                            <div className="col-md-4">
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
                            <div className="col-md-4">
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
                            <div className="col-md-6">
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
                            <div className="col-md-6">
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
                            <div className="col-md-3">
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
                                        accept="image/png, image/jpeg, image/gif"
                                        className={`form-control ${errors.photo ? 'is-invalid' : null }`}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
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
                                        accept="image/png, image/jpeg, image/gif"
                                        className={`form-control ${errors.signature ? 'is-invalid' : null }`}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
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
                                        accept="image/png, image/jpeg, image/gif"
                                        className={`form-control ${errors.aadhar_card ? 'is-invalid' : null }`}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
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
                                    <label>{t('upload_identity_proof')} <RequiredField /></label>
                                    <input 
                                        type="file" 
                                        name="identity_proof"
                                        accept="image/png, image/jpeg, image/gif"
                                        className={`form-control ${errors.identity_proof ? 'is-invalid' : null }`}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.identity_proof }
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    {/* </div>
                </div> */}
            </form>
        </div>
    )
}
export default SuretyForm