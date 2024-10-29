import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useLocation } from 'react-router-dom';
import { CreateMarkup } from '../../utils';

import Button from '@mui/material/Button'
import api from '../../api'
import Document from './Document';

const ResponseCreate = () => {

    const {state} = useLocation()
    const[petition, setPetition] = useState({
        filing_type: {}
    })
    const[accused, setAccused] = useState([])
    const[crime, setCrime] = useState({})
    const[policeResponse, setPoliceResponse] = useState([])
    const initialState = {
        cino               : '',
        response_type      : '',
        accused_name       : '',
        accused_type       : '',
        discharged         : '',
        hospital_name      : '',
        victim_condition   : '',
        remarks            : ''
    }

    const[form, setForm] = useState(initialState)

    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`prosecution/filing/detail/`, {params:{efile_no:state.efile_no}})
            if(response.status === 200){
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_no
                })
                setPetition(response.data.petition)
                setAccused(response.data.litigant)
                setCrime(response.data.crime)
                setPoliceResponse(response.data.response)
            }
        }
        fetchData()
    }, [])

    console.log(policeResponse)

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            const response = await api.post("api/bail/prosecution/remarks/create/", form)
            if(response.status === 201){
                toast.success("Remarks added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }
    }
    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Prosecution Remarks</strong></h3>
                        </div>
                        <div className="card-body">
                            <div className="card card-outline card-warning">
                                <div className="card-header">
                                    <strong>Petition Details</strong>
                                </div>
                                <div className="card-body p-1">
                                <table className="table table-bordered table-striped table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Petition&nbsp;Number</td>
                                            <td>
                                                {`${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}`}
                                            </td>
                                            <td>Crime&nbsp;Number</td>
                                            <td>{`${crime.fir_number }/${ crime.fir_year }`}</td>
                                            <td>Date of FIR</td>
                                            <td>{ crime.fir_date_time }</td>
                                        </tr>
                                        <tr>
                                            <td>Police&nbsp;Station</td>
                                            <td>{ crime.police_station ? crime.police_station : null }</td>
                                            <td>Date of Occurence</td>
                                            <td>{ crime.date_of_occurrence }</td>
                                            <td>Complainant&nbsp;Name</td>
                                            <td>{crime.complainant_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Gist of FIR</td>
                                            <td colSpan={5}>{ crime.gist_of_fir }</td>
                                        </tr>
                                        <tr>
                                            <td>Gist&nbsp;in&nbsp;Local&nbsp;Language</td>
                                            <td colSpan={5}><span dangerouslySetInnerHTML={CreateMarkup(crime.gist_in_local)}></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div className="card card-outline card-secondary">
                                <div className="card-header">
                                    <strong>Accused Details</strong>
                                </div>
                                <div className="card-body p-1">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm">
                                            <thead>
                                                <tr className="bg-secondary">
                                                    <th>#</th>
                                                    <th>Accused Name</th>
                                                    <th>Age</th>
                                                    <th>Rank</th>
                                                    <th>Relative</th>
                                                    <th>Relative Name</th>
                                                    <th>Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { accused.filter(l=>l.litigant_type===1).map((a, index) => (
                                                    <tr>
                                                        <td>{ index+1 }</td>
                                                        <td>{ a.litigant_name }</td>
                                                        <td>{ a.age }</td>
                                                        <td>{ a.rank }</td>
                                                        <td>{ a.relation }</td>
                                                        <td>{ a.relation_name }</td>
                                                        <td>{ a.address }</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-outline card-info">
                                <div className="card-header"><strong>Police Response</strong></div>
                                <div className="card-body p-1">
                                { policeResponse.map((r, index) => (
                            <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    <tr>
                                        <td>Offences</td>
                                        <td>{r.offences}</td>
                                    </tr>
                                    <tr>
                                        <td>Date of Arrest</td>
                                        <td>{ r.date_of_arrest }</td>
                                    </tr>
                                    <tr>
                                        <td>Name of the accused/suspected person(s)</td>
                                        <td>{r.accused_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Specific Allegations /Overt Acts against the Petitioner(s)</td>
                                        <td>{ r.specific_allegations}</td>
                                    </tr>
                                    <tr>
                                        <td>Materials & Circumstances against the Petitioner</td>
                                        <td>{ r.materials_used}</td>
                                    </tr>
                                    <tr>
                                        <td>Injured discharged</td>
                                        <td>{r.discharged}</td>
                                    </tr>
                                    <tr>
                                        <td>Hospital Name</td>
                                        <td>{r.hospital_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Condition of Victim</td>
                                        <td>{r.victim_condition}</td>
                                    </tr>
                                    <tr>
                                        <td>Particulars of Injury</td>
                                        <td>{r.injury_particulars}</td>
                                    </tr>
                                    <tr>
                                        <td>Stage of Investigation / Trial</td>
                                        <td>{r.investigation_stage}</td>
                                    </tr>
                                    <tr>
                                        <td>CNR Number</td>
                                        <td>{r.cnr_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Court</td>
                                        <td>{r.court}</td>
                                    </tr>
                                    <tr>
                                        <td>Stage of the Case</td>
                                        <td>{r.case_stage}</td>
                                    </tr>
                                    <tr>
                                        <td>Next Hearing Date</td>
                                        <td>{ r.next_hearing }</td>
                                    </tr>
                                    <tr>
                                        <td>No. Of. Witness</td>
                                        <td>{ r.no_of_witness }</td>
                                    </tr>
                                    <tr>
                                        <td>Antecedents/Previous Cases against the Petitioner(s)</td>
                                        <td>{ r.previous_case }</td>
                                    </tr>
                                    <tr>
                                        <td>Details of Previous Bail Applications</td>
                                        <td>{ r.previous_bail}</td>
                                    </tr>
                                    <tr>
                                        <td>Status of other accused</td>
                                        <td>{ r.other_accused_status }</td>
                                    </tr>
                                    <tr>
                                        <td>Why Bail/AB Should Not be Granted</td>
                                        <td>{ r.reason_not_given }</td>
                                    </tr>
                                    <tr>
                                        <td>Any other Information</td>
                                        <td>{ r.other_information }</td>
                                    </tr>
                                    <tr>
                                        <td>Court Details: FIR/ Committal/Trial/ Appellate</td>
                                        <td>{ r.court_details }</td>
                                    </tr>
                                </tbody>
                            </table>
                            ))}
                                </div>
                            </div>
                            <div className="card card-outline card-danger">
                                <div className="card-header"><strong>Remarks</strong></div>
                                <div className="card-body">
                                    <form method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="form-group row">
                                                    <label className="col-sm-4"></label>
                                                    <div className="col-sm-4">
                                                        <label htmlFor="">Accused Name</label>
                                                        {accused.filter(l=>l.litigant_type===1).map((a, index)=>(
                                                            <input 
                                                                type="text" 
                                                                className="form-control mb-3" 
                                                                name="accused_name"
                                                                value={a.litigant_name}
                                                                readOnly={true}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <label htmlFor="">Accused Type</label>
                                                        {accused.filter(l=>l.litigant_type===1).map((a, index)=>(
                                                            <select 
                                                                name={`accused_type_${index+1}`}
                                                                className="form-control mb-3"
                                                                value={form.accused_type}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            >
                                                                <option value="">Select type</option>
                                                                <option value="First time offender">First time offender</option>
                                                                <option value="Habitual offender">Habitual offender</option>
                                                            </select>
                                                            

                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Injured discharged</label>
                                                    <div className="col-sm-8">
                                                        <div className="icheck-success d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged1" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                                                checked={parseInt(form.discharged) === 1 ? true : false}
                                                            />
                                                            <label htmlFor="radioDischarged1">Yes</label>
                                                        </div>
                                                        <div className="icheck-danger d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged2" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 2})} 
                                                                checked={parseInt(form.discharged) === 2 ? true : false}/>
                                                            <label htmlFor="radioDischarged2">No</label>
                                                        </div>
                                                        <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged3" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 3})} 
                                                                checked={parseInt(form.discharged) === 3 ? true : false}/>
                                                            <label htmlFor="radioDischarged3">Not Applicable</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* { !form.discharged && (
                                                    <>
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3">Hospital Name</label>
                                                            <div className="col-sm-9">
                                                                <input 
                                                                    type="text" 
                                                                    className="form-control" 
                                                                    name="hospital_name"
                                                                    value={form.hospital_name}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3">Condition of Victim</label>
                                                            <div className="col-sm-9">
                                                                <input 
                                                                    type="text" 
                                                                    className="form-control" 
                                                                    name="victim_condition"
                                                                    value={form.victim_condition}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )} */}
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-4">Remarks</label>
                                                    <div className="col-sm-8">
                                                        <textarea 
                                                            name="remarks" 
                                                            rows="5" 
                                                            className="form-control"
                                                            value={form.remarks}
                                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <Document />
                                                <div className="pb-2">
                                                    <Button
                                                        variant='contained'
                                                        color="success"
                                                        type="submit"
                                                    >Submit</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    

        </>
    )
}

export default ResponseCreate