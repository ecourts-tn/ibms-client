import React, {useState, useEffect } from 'react'
import api from '../../api'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import GroundsContainer from '../grounds/GroundsContainer'
import DocumentContainer from '../documents/DocumentContainer'
import { toast, ToastContainer } from 'react-toastify'

const SearchBail = () => {

    const[form, setForm] = useState({
        case_type: undefined,
        case_number: undefined,
        case_year: undefined
    })
    const[grounds, setGrounds] = useState([])
    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.number().required('Case Number is required'),
        case_year: Yup.number().required('Year is required')
    })

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

    const deleteRespondent = (respondent) => {
        const newRespondent = respondents.filter((res) => { return res.id !== respondent.id })
        setRespondents(newRespondent)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, {abortEarly:false})
            try{
                const response = await api.get("api/bail/petition/detail/", {form})
                console.log(response)
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.petitioner)
                    setRespondents(response.data.respondent)
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }catch(error){
            const newErrors = {}
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message
            });
            setErrors(newErrors)
        }
    }
    console.log(respondents)
    return (
        <>
            <ToastContainer />
            <div className="container mt-5">
            <form onSubmit={handleSubmit} method="POST">
                <div className="row my-3">
                    <div className="col-md-3 offset-2">
                        <div className="form-group">
                            <label htmlFor="case_type">Case Type</label>
                            <select 
                                name="case_type" 
                                className={`form-control ${errors.case_type ? 'is-invalid' : ''}`} 
                                value={form.case_type}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                            >
                                <option value="">Select Case Type</option>
                                <option value="1">Bail Petition</option>
                            </select>
                            <div className="invalid-feedback">
                                { errors.case_type }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="case_number">Case Number</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.case_number ? 'is-invalid' : ''}`} 
                                name="case_number"
                                value={form.case_number}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                            />
                            <div className="invalid-feedback">
                                { errors.case_number }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="case_year">Year</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.case_year ? 'is-invalid' : ''}`}
                                name="case_year"
                                value={form.case_year}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                            />
                            <div className="invalid-feedback">
                                { errors.case_year }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1 mt-4 pt-2">
                        <Button
                            variant='contained'
                            type="submit"
                            color="success"
                        >Search</Button>
                    </div>
                </div>
            </form>
            <div>
                { Object.keys(petition).length > 0 && (
                    <table className="table table-bordered table-striped table-sm">
                        { petition && (
                        <>
                            <tr>
                                <td colSpan={4} className="bg-primary"><strong>Basic Details</strong></td>
                            </tr>
                            <tr>
                                <td>Court Type</td>
                                <td>{ petition.court_type.court_type }</td>
                                <td>Bench Type</td>
                                <td>{ petition.bench_type ? petition.bench_type.bench_type : '-'}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>{ petition.state.state_name }</td>
                                <td>District</td>
                                <td>{ petition.district.district_name }</td>
                            </tr>
                            <tr>
                                <td>Establishment</td>
                                <td>{ petition.establishment.establishment_name }</td>
                                <td>Court</td>
                                <td>{ petition.court.court_name }</td>
                            </tr>
                            <tr>
                                <td>Case Type</td>
                                <td>{ petition.case_type.type_name }</td>
                                <td>Bail Type</td>
                                <td>{ petition.bail_type.type_name }</td>
                            </tr>
                            <tr>
                                <td>Crime Registered</td>
                                <td>{ petition.crime_registered === 1 ? 'Yes' : 'No' }</td>
                                <td>Compliant Type</td>
                                <td>{ petition.complaint_type.type_name }</td>
                            </tr>
                        </>
                        )}
                    </table>
                    )}
                { Object.keys(respondents).length > 0 && (
                    <table className=" table table-bordered table-striped table-sm">
                        <thead>
                            <tr className="bg-primary">
                                <td colSpan={6}><strong>Respondent Details</strong></td>
                            </tr>
                            <tr>
                                <th>S.No.</th>
                                <th>Respondent Name</th>
                                <th>Designation</th>
                                <th>Police Station</th>
                                <th>District</th>
                                <th width={120}>
                                    Action
                                    <span className="badge bg-success float-right mt-1"><i className="fa fa-plus-circle mr-1"></i>New</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { respondents.map((respondent, index) => (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{respondent.respondent_name}</td>
                                    <td>{respondent.designation}</td>
                                    <td>{respondent.address}</td>
                                    <td>{respondent.district}</td>
                                    <td>
                                        <i className="fa fa-pencil-alt text-primary"></i>
                                        <i 
                                            className="fa fa-trash-alt text-danger ml-3"
                                            onClick={() => deleteRespondent(respondent)}
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <p>Condition Details</p>
                { Object.keys(advocates).length > 0 && (
                <table className=" table table-bordered table-striped table-sm">
                    <thead>
                        <tr className="bg-primary">
                            <td colSpan={6}><strong>Advocate Details</strong></td>
                        </tr>
                        <tr>
                            <th>S.No.</th>
                            <th>Advocate Name</th>
                            <th>Enrolment Number</th>
                            <th>Mobile Number</th>
                            <th>Email Address</th>
                            <th width={120}>
                                Action
                                <span className="badge bg-success float-right mt-1"><i className="fa fa-plus-circle mr-1"></i>New</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { advocates.map((advocate, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{advocate.advocate_name}</td>
                                <td>{advocate.enrolment_number}</td>
                                <td>{advocate.advocate_mobile}</td>
                                <td>{advocate.advocate_email}</td>
                                <td>
                                    <i 
                                        className="fa fa-pencil-alt text-primary"
                                        
                                    ></i>
                                    <i 
                                        className="fa fa-trash-alt text-danger ml-3"
                                        onClick={() => deleteAdvocate(advocate)}
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                { Object.keys(petition).length > 0 && (
                    <>
                        <GroundsContainer grounds={grounds}/>
                        <DocumentContainer />
                    </>
                )}
            </div>
            </div>
        </>
    )
}

export default SearchBail