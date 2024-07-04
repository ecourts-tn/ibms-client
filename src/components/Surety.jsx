import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import SearchBail from './IntervenePetition/SearchBail';
import TextField from '@mui/material/TextField';
import api from '../api';
import axios from 'axios';

const Surety = () => {

  const [formData, setFormData] = useState({
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
    business_taluk: '',
    business_district: '',
    business_state: '',
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
  });

  const addBankAccount = () => {}

  const handleBankAccountChange = () =>{}

  const removeBankAccount = () => {}

  const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]:value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    console.log(formData);
  };

  return(
        <>
            <div className="container mt-5">
                <SearchBail />
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* <div className="col-md-2">
                            <div className="form-group">
                                <label>Case Number</label>
                                <input 
                                    type="text" 
                                    name="case_number" 
                                    className='form-control'
                                    value={formData.caseNo} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Year</label>
                                <input 
                                    type="text" 
                                    name="year" 
                                    value={formData.year} 
                                    onChange={handleChange} 
                                    className="form-control"
                                />
                            </div>
                        </div> */}
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Name of Surety</label>
                                <input 
                                    type="text" 
                                    name="surety_name" 
                                    value={formData.surety_name} 
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="">Relation</label>
                                <select 
                                    name="relation" 
                                    className="form-control"
                                    value={formData.relation}
                                    onChange={handleChange}
                                >
                                    <option value="">Select relation</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Relative Name of Surety</label>
                                <input 
                                    type="text" 
                                    name="relative_name" 
                                    value={formData.relative_name} 
                                    onChange={handleChange}
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
                                    value={formData.aadhar_number} 
                                    onChange={handleChange} 
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
                                    value={formData.address} 
                                    onChange={handleChange} 
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
                                    value={formData.state}
                                    onChange={handleChange}
                                >
                                    <option value="">Select state</option>
                                    <option value="33">Tamil Nadu</option>
                                    <option value="34">Pudhucherry</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="">District</label>
                                <select 
                                    name="district"
                                    className="form-control"
                                    value={formData.district}
                                    onChange={handleChange}
                                >
                                    <option value="">Select district</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="">Taluk</label>
                                <select 
                                    name="taluk"
                                    className="form-control"
                                    value={formData.taluk}
                                    onChange={handleChange}
                                >
                                    <option value="">Select taluk</option>
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
                                    value={formData.pincode}
                                    onChange={handleChange}
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
                                    value={formData.phone_number}
                                    onChange={handleChange}
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
                                    value={formData.email_address}
                                    onChange={handleChange}
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
                                    value={formData.residing_years}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Property Type</label>
                                <select 
                                    name="property_type" 
                                    value={formData.property_type} 
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Select type</option>
                                    <option value="1">Own</option>
                                    <option value="2">Rental</option>
                                </select>
                            </div>
                        </div>
                        { parseInt(formData.property_type) === 1 && (
                        <>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="">Survey Number</label>
                                <input 
                                    type="text"
                                    name="survey_number"
                                    value={formData.survey_number}
                                    onChange={handleChange} 
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
                                    value={formData.site_location}
                                    onChange={handleChange}  
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
                                    value={formData.site_area}
                                    onChange={handleChange}
                                    className="form-control"  
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="">Valuation</label>
                                <input 
                                    type="text"
                                    name="site_valuation"
                                    value={formData.site_valuation}
                                    onChange={handleChange}
                                    className="form-control"  
                                />
                            </div>
                        </div>
                        </>   
                        )}
                        { parseInt(formData.property_type) === 2 && (
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Rent Bill in the name of Surety</label><br />
                                <div>
                                    <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="rent_bill_surety_name" 
                                        id="isRelatedYes" 
                                        value={formData.rent_bill_surety_name}
                                        checked={ formData.rent_bill_surety_name }
                                        onChange={(e) => setFormData({...formData, rent_bill_surety_name: true})} 
                                    />
                                    <label htmlFor="isRelatedYes">Yes</label>
                                    </div>
                                    <div className="icheck-danger d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="custodyNo" 
                                        name="rent_bill_surety_name" 
                                        value={formData.rent_bill_surety_name}
                                        checked={ !formData.rent_bill_surety_name } 
                                        onChange={(e) => setFormData({...formData, rent_bill_surety_name: false})}
                                    />
                                    <label htmlFor="custodyNo">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                       
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="">{parseInt(formData.property_type) === 1 ? 'Upload patta/chitta' : 'Upload rental agreement/receipt'}</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    name="property_document"
                                    value={formData.property_document}
                                />
                            </div>
                        </div>
                     
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Type of Employment</label>
                                <select 
                                    name="employment_type" 
                                    value={ formData.employment_type } 
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Select type</option>
                                    <option value="1">Employed</option>
                                    <option value="2">Business</option>
                                    <option value="3">Unemployed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    { parseInt(formData.employment_type) === 1 && (
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Employer Name</label>
                                        <input type="text" 
                                            name="employer_name" 
                                            value={formData.employer_name} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Designation</label>
                                        <input type="text" 
                                            name="designation" 
                                            value={formData.designation} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Employer Address</label>
                                        <input type="text" 
                                            name="employer_address" 
                                            value={formData.employer_address} 
                                            onChange={handleChange} 
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
                                            value={formData.employer_state}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select state</option>
                                            <option value="33">Tamil Nadu</option>
                                            <option value="34">Pudhucherry</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="">District</label>
                                        <select 
                                            name="employer_district"
                                            className="form-control"
                                            value={formData.employer_district}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select district</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="">Taluk</label>
                                        <select 
                                            name="employer_taluk"
                                            className="form-control"
                                            value={formData.employer_taluk}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select taluk</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Length of Service with Employer</label>
                                        <input 
                                            type="text" 
                                            name="service_length" 
                                            value={formData.service_length} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Amount of Provident Fund</label>
                                        <input 
                                            type="text" 
                                            name="pf_amount" 
                                            value={formData.pf_amount} 
                                            onChange={handleChange}
                                            className="form-control" 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>House Property Details</label>
                                        <textarea 
                                            name="property_details" 
                                            value={formData.property_details} 
                                            onChange={handleChange} 
                                            className='form-control'
                                            rows={1}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Income Tax Paid (Last 3 Years)</label>
                                        <input 
                                            type="text"
                                            name="income_tax_paid" 
                                            value={formData.income_tax_paid} 
                                            onChange={handleChange} 
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    { parseInt(formData.employment_type) === 2 && (
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Business Address</label>
                                        <input 
                                            type="text" 
                                            name="business_address" 
                                            value={formData.business_address} 
                                            onChange={handleChange} 
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
                                            value={formData.business_state}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select state</option>
                                            <option value="33">Tamil Nadu</option>
                                            <option value="34">Pudhucherry</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="">District</label>
                                        <select 
                                            name="business_district"
                                            className="form-control"
                                            value={formData.business_district}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select district</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="">Taluk</label>
                                        <select 
                                            name="business_taluk"
                                            className="form-control"
                                            value={formData.business_taluk}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select taluk</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Nature and Extent of Business</label>
                                        <input 
                                            type="text" 
                                            name="business_nature" 
                                            value={formData.business_nature} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Rent Paid for Place of Business</label>
                                        <input 
                                            type="text" 
                                            name="business_rent_paid" 
                                            value={formData.business_rent_paid} 
                                            onChange={handleChange} 
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
                                                value={ formData.is_rent_bill_name }
                                                checked={ formData.is_rent_bill_name }
                                                onChange={(e) => setFormData({...formData, is_rent_bill_name: true})} 
                                            />
                                            <label htmlFor="isRentBillYes">Yes</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                id="isRentBillNo" 
                                                name="is_rent_bill_name" 
                                                value={formData.is_rent_bill_name}
                                                checked={ !formData.is_rent_bill_name } 
                                                onChange={(e) => setFormData({...formData, is_rent_bill_name: false})}
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
                                                value={formData.bank_name}
                                                onChange={(e) => handleBankAccountChange(e)}
                                                className="form-control"
                                            />
                                        </div> 
                                        <div className="col-md-3">
                                            <input
                                                type="text"
                                                name="branch_name"
                                                placeholder="Branch Name"
                                                value={formData.branch_name}
                                                onChange={(e) => handleBankAccountChange(e)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <input
                                                type="text"
                                                name="account_number"
                                                placeholder="Account Number"
                                                value={formData.account_number}
                                                onChange={(e) => handleBankAccountChange(e)}
                                                className="form-control"
                                            />
                                        </div> 
                                        <div className="col-md-2">
                                            <input
                                                type="text"
                                                name="amount"
                                                placeholder="Amount"
                                                value={formData.amount}
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
                                        <label>Known Accused Duration</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <input
                                                    type="text"
                                                    name="accused_duration"
                                                    placeholder="Years"
                                                    value={formData.accused_duration_year}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                name="months"
                                                placeholder="Months"
                                                value={formData.accused_duration_month}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>  
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Related to Accused</label>
                                        <div>
                                            <div className="icheck-success d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                name="is_related" 
                                                id="isRelatedYes" 
                                                value={formData.is_related}
                                                checked={ formData.is_related }
                                                onChange={(e) => setFormData({...formData, is_related: true})} 
                                            />
                                            <label htmlFor="isRelatedYes">Yes</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                            <input 
                                                type="radio" 
                                                id="isRelatedNo" 
                                                name="is_related" 
                                                value={formData.is_related}
                                                checked={ !formData.is_related } 
                                                onChange={(e) => setFormData({...formData, is_related: false})}
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
                                            value={formData.relation_details} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Surety for Others</label>
                                        <textarea 
                                            name="others_surety" 
                                            value={formData.others_surety} 
                                            onChange={handleChange} 
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
                                            value={formData.litigation_details} 
                                            onChange={handleChange} 
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
                                            value={formData.other_particulars} 
                                            onChange={handleChange} 
                                            className="form-control"
                                            rows={1}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label>Surety Amount</label>
                                        <input 
                                            type="text" 
                                            name="surety_amount" 
                                            value={formData.surety_amount} 
                                            onChange={handleChange} 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Upload Photo</label>
                                        <input 
                                            type="file" 
                                            name="photo"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Upload Signature</label>
                                        <input 
                                            type="file" 
                                            name="signature"
                                            className="form-control"
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
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        color="success"
                                    >Submit</Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        className="ml-2"
                                    >Reset</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

//   return (
//     <>
//         <div className="container my-2">
            
//         <div>
//     </>                
// )
// }

export default Surety;