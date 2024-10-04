import React, {useState, useEffect, useContext, useRef} from 'react'
import { RequiredField } from 'utils'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { TalukContext } from 'contexts/TalukContext'
import { RelationContext } from 'contexts/RelationContext'
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';


const SuretyForm = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {taluks}    = useContext(TalukContext)
    const {relations} = useContext(RelationContext)  
    
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
        phone_number: '',
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
        identity_proof:''
    }
    const[surety, setSurety] = useState(initialState);
    const[errors, setErrors] = useState({})

    const stepperRef = useRef(null);

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

    const handleBankAccountChange = () => {

    }

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true,
        });
    }, []);


    return (
        <form onSubmit={handleSubmit} encType='multipart/form-data' method='POST'>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Name of Surety<RequiredField /></label>
                        <input 
                            type="text" 
                            name="surety_name" 
                            value={surety.surety_name} 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Parentage <RequiredField/></label>
                        <select 
                            name="relation" 
                            className="form-control"
                            value={surety.relation}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select parentage</option>
                            { relations.map((relation, index) => (
                            <option key={index} value={relation.id}>{relation.relation_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Name of the parentage <RequiredField/></label>
                        <input 
                            type="text" 
                            name="relative_name" 
                            value={surety.relative_name} 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            className="form-control" 
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Aadhar Number</label>
                        <input 
                            type="text" 
                            name="aadhar_number" 
                            value={surety.aadhar_number} 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={surety.address} 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">State</label>
                        <select 
                            name="state" 
                            className="form-control"
                            value={surety.state}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select state</option>
                            { states.map((state, index) => (
                            <option key={index} value={state.state_code}>{state.state_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">District</label>
                        <select 
                            name="district"
                            className="form-control"
                            value={surety.district}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select district</option>
                            { districts.filter(d=>parseInt(d.state)===parseInt(surety.state)).map((district, index) => (
                            <option value={district.district_code} key={index}>{district.district_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">Taluk</label>
                        <select 
                            name="taluk"
                            className="form-control"
                            value={surety.taluk}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select taluk</option>
                            { taluks.filter(t=>parseInt(t.district)===parseInt(surety.district)).map((taluk, index) => (
                            <option value={taluk.id} key={index}>{taluk.taluk_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Pincode</label>
                        <input 
                            type="text"
                            name="pincode"
                            className="form-control"
                            value={surety.pincode}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Phone Number</label>
                        <input 
                            type="text"
                            name="phone_number"
                            className="form-control"
                            value={surety.phone_number}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">E-Mail Address</label>
                        <input 
                            type="text"
                            name="email_address"
                            className="form-control"
                            value={surety.email_address}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Residing Since (Years)</label>
                        <input 
                            type="text"
                            name="residing_years"
                            className="form-control"
                            value={surety.residing_years}
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Property Type</label>
                        <select 
                            name="property_type" 
                            value={surety.property_type} 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Select type</option>
                            <option value="1">Own</option>
                            <option value="2">Rental</option>
                        </select>
                    </div>
                </div>
                { parseInt(surety.property_type) === 1 && (
                <>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Survey Number</label>
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
                        <label htmlFor="">Location</label>
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
                        <label htmlFor="">Area in cent(s)</label>
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
                        <label htmlFor="">Valuation</label>
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
                        <label>Rent Bill in the name of Surety</label><br />
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
                            <label htmlFor="isRentBillYes">Yes</label>
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
                            <label htmlFor="isRentBillNo">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="">{parseInt(surety.property_type) === 1 ? 'Upload patta/chitta' : 'Upload rental agreement/receipt'}</label>
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
                        <label>Occupation</label>
                        <select 
                            name="employment_type" 
                            value={ surety.employment_type } 
                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Select type</option>
                            <option value="1">Employed</option>
                            <option value="2">Self Employed</option>
                            <option value="3">Business</option>
                            <option value="4">Agriculture</option>
                            <option value="5">Unemployed</option>
                        </select>
                    </div>
                </div>
            </div>
            { parseInt(surety.employment_type) === 1 && (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Employer Name</label>
                                <input type="text" 
                                    name="employer_name" 
                                    value={surety.employer_name} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Designation</label>
                                <input type="text" 
                                    name="designation" 
                                    value={surety.designation} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Employer Address</label>
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
                                <label htmlFor="">State</label>
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
                                <label htmlFor="">District</label>
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
                                <label htmlFor="">Taluk</label>
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
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Length of Service with Employer</label>
                                <input 
                                    type="number" 
                                    name="service_length" 
                                    value={surety.service_length} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Amount of Provident Fund</label>
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
                                <label>House Property Details</label>
                                <textarea 
                                    name="property_details" 
                                    value={surety.property_details} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className='form-control'
                                    rows={1}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Income Tax Paid (Last 3 Years)</label>
                                <input 
                                    type="number"
                                    name="income_tax_paid" 
                                    value={surety.income_tax_paid} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="">Upload Document</label>
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
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Business Address</label>
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
                                <label htmlFor="">State</label>
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
                                <label htmlFor="">District</label>
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
                                <label htmlFor="">Taluk</label>
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
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Nature and Extent of Business</label>
                                <input 
                                    type="text" 
                                    name="business_nature" 
                                    value={surety.business_nature} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Rent Paid for Place of Business</label>
                                <input 
                                    type="number" 
                                    name="business_rent_paid" 
                                    value={surety.business_rent_paid} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="form-group">
                                <label>Rent Bill of Place of Business in name of Surety</label>
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
                                    <label htmlFor="isRentBillYes">Yes</label>
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
                                    <label htmlFor="isRentBillNo">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="">Upload Document</label>
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
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <label>Bank Accounts</label>
                            <div className="row">
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="bank_name"
                                        placeholder="Bank Name"
                                        value={surety.bank_name}
                                        onChange={(e) => handleBankAccountChange(e)}
                                        className="form-control"
                                    />
                                </div> 
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="branch_name"
                                        placeholder="Branch Name"
                                        value={surety.branch_name}
                                        onChange={(e) => handleBankAccountChange(e)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        name="account_number"
                                        placeholder="Account Number"
                                        value={surety.account_number}
                                        onChange={(e) => handleBankAccountChange(e)}
                                        className="form-control"
                                    />
                                </div> 
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        name="ifsc_code"
                                        placeholder="IFSC Code"
                                        value={surety.ifsc_code}
                                        onChange={(e) => handleBankAccountChange(e)}
                                        className="form-control"
                                    />
                                </div> 
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-2">
                                    <Button
                                        variant='contained'
                                        color='primary'
                                    >Add</Button>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        className="ml-1"
                                    >Delete</Button>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Acquaintance duration</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <input
                                            type="text"
                                            name="accused_duration_year"
                                            placeholder="Years"
                                            value={surety.accused_duration_year}
                                            onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                            className="form-control"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="accused_duration_month"
                                        placeholder="Months"
                                        value={surety.accused_duration_month}
                                        onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})}
                                        className="form-control"
                                    />
                                </div>  
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Related to accused?</label>
                                <div>
                                    <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="is_related" 
                                        id="isRelatedYes" 
                                        value={surety.is_related}
                                        checked={ surety.is_related }
                                        onChange={(e) => setSurety({...surety, is_related: true})} 
                                    />
                                    <label htmlFor="isRelatedYes">Yes</label>
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
                                    <label htmlFor="isRelatedNo">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Relation Details</label>
                                <input 
                                    type="text" 
                                    name="relation_details" 
                                    value={surety.relation_details} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Whether surety has furnished any other cases</label>
                                <textarea 
                                    name="others_surety" 
                                    value={surety.others_surety} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                    rows={1}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Litigation Details</label>
                                <textarea 
                                    name="litigation_details" 
                                    value={surety.litigation_details} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                    rows={1}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Other Particulars</label>
                                <textarea 
                                    name="other_particulars" 
                                    value={surety.other_particulars} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                    rows={1}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Surety Amount</label>
                                <input 
                                    type="number" 
                                    name="surety_amount" 
                                    value={surety.surety_amount} 
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.value})} 
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Upload Aadhar<RequiredField /></label>
                                <input 
                                    type="file" 
                                    name="aadhar"
                                    className="form-control"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Upload Photo<RequiredField /></label>
                                <input 
                                    type="file" 
                                    name="photo"
                                    className="form-control"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Upload Signature<RequiredField/></label>
                                <input 
                                    type="file" 
                                    name="signature"
                                    className="form-control"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Upload Identity Proof</label>
                                <input 
                                    type="file" 
                                    name="identity_proof"
                                    className="form-control"
                                    onChange={(e) => setSurety({...surety, [e.target.name]: e.target.files[0]})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <Button
                                variant="contained"
                                color="success"
                                type='submit'
                            >Save</Button>
                            <Button
                                variant="contained"
                                color="warning"
                                className="ml-2"
                            >Reset</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <Button
                    variant='contained'
                    color='info'
                    onClick={() => stepperRef.current.next()}
                    endIcon={<ArrowForward />}
                >Next</Button>
            </div>
        </form>
    )
}

export default SuretyForm