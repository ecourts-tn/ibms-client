import api from 'api'
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/CancelRounded'
import ViewDocument from 'components/utils/ViewDocument'

const SuretyVerify = () => {

    const {state} = useLocation()

    const[verify, setVerify] = useState(1)
    const[surety, setSurety] = useState({})

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const initialState = {
        verification_date: null,
        complaince_date: null,
        remarks: '',
        status:''
    }
    const[form, setForm] = useState(initialState)

    useEffect(() => {
        async function fetchRecord(){
            try{
                const response = await api.get("api/bail/surety/detail/", {params:{cino:state.cino}})
                if(response.status === 200){
                    setSurety(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchRecord()
    }, [])

    const handleSubmit = async () => {
        if(form.status === 1){
            // update main table only
            try{
                const response = await api.put(`api/bail/surety/${state.cino}/update/`, {
                    verification_date: form.complaince_date,
                    status:form.status,
                    is_verified:true
                })
                if(response.status === 200){
                    toast.success("Petition verified successfully", {
                        theme:"colored"
                    })
                    setForm(initialState)
                }
            }catch(error){
                console.log(error)
            }
        }
        else if(form.status === 2){
            // update main table and add objection history
            try{
                const response = await api.put(`api/bail/surety/${state.cino}/update/`, {
                    verification_date: form.complaince_date,
                    status:form.status,
                    is_verified:true
                })
                if(response.status === 200){
                    const response = await api.post(`api/bail/surety/${state.cino}/objection/create/`, {
                        objection_date: form.verification_date,
                        complaince_date: form.complaince_date,
                        remarks: form.remarks
                    })
                    if(response.status === 201){
                        toast.success("Petition verified successfully", {
                            theme:"colored"
                        })
                    }
                }
                setForm(initialState)
            }catch(error){
                console.log(error)
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Petition Details</strong></h3>
                        </div>
                        <div className="card-body">
                            <div id="accordion">
                                <div className="card m-1">
                                    <div className="card-header" id="headingOne">
                                        <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">Surety Details</a>
                                    </div>
                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div className="card-body">
                                            <table className="table table-striped table-bordered table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Surety Name</td>
                                                        <td>{ surety.surety_name }</td>
                                                        <td>Relation</td>
                                                        <td>{ surety.relation ? surety.relation.relation_name : null }</td>
                                                        <td>Relation Name</td>
                                                        <td>{ surety.relative_name }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Aadhaar Number</td>
                                                        <td>{ surety.aadhar_number }</td>
                                                        <td>Mobile Number</td>
                                                        <td>{ surety.phone_number }</td>
                                                        <td>E-Mail Address</td>
                                                        <td>{ surety.email_address }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address</td>
                                                        <td colSpan={5}>
                                                            { `${surety.address}, ` }
                                                            { surety.taluk ? `${surety.taluk.taluk_name}, ` : null}
                                                            { surety.district ? `${surety.district.district_name}, ` : null }
                                                            { surety.state ? `${surety.state.state_name}, ` : null }
                                                            { surety.pincode ? ` - ${surety.pincode}` : null }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Residing Since</td>
                                                        <td>{ surety.residing_years }</td>
                                                        <td>Property Type</td>
                                                        <td>{ parseInt(surety.property_type) === 1 ? 'Own' : 'Rent'}</td>
                                                        <td>Survey Number</td>
                                                        <td>{ surety.survey_number }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Location</td>
                                                        <td>{ surety.site_location }</td>
                                                        <td>Area in cent(s)</td>
                                                        <td>{ surety.site_area}</td>
                                                        <td>Valuation</td>
                                                        <td>{ surety.site_valuation }</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <Link
                                                                onClick={handleShow}
                                                            >View Patta/Chitta or Rental Agreement</Link>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            { show && (
                                                <ViewDocument 
                                                    url={`http://127.0.0.1:8000/${surety.photo}`}
                                                    show={show} 
                                                    setShow={setShow} 
                                                    handleClose={handleClose} 
                                                    handleShow={handleShow}/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingTwo">
                                        <a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" href="/#">
                                            Employment Details
                                        </a>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div className="card-body p-2">

                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingThree">
                                        <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                            Business Details
                                        </a>
                                    </div>
                                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                        <div className="card-body p-2">

                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingFour">
                                        <a data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" href="/#">
                                            Additional Details
                                        </a>
                                    </div>
                                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-3">
                                <div className="col-md-8 offset-2">
                                    <div className="form-group row mt-4">
                                        <label htmlFor="verify" className="col-sm-3">Verify</label>
                                        <div className="col-sm-9">
                                            <div className="icheck-success d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioVerify1" 
                                                    name="status" 
                                                    onChange={(e) => setForm({...form, status:1})}
                                                    checked={form.status === 1 ? true : false}

                                                />
                                                <label htmlFor="radioVerify1">Accept</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioVerify2" 
                                                    name="status" 
                                                    onChange={(e) => setForm({...form, status:2})}
                                                    checked={form.status === 2 ? true : false }
                                                />
                                                <label htmlFor="radioVerify2">Return</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-3">{form.status === 2 ? 'Objection' : 'Verification'}&nbsp;Date</label>
                                        <div className="col-sm-4">
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                name="verification_date"
                                                value={form.verification_date}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                { form.status === 2 && (
                                <>
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group row">
                                            <label htmlFor="date" className="col-sm-3">Complaince Date</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    name="complaince_date"
                                                    value={form.complaince_date}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group">
                                            <label htmlFor="remarks">Remarks</label>
                                            <textarea 
                                                name="remarks" 
                                                className="form-control" 
                                                rows="2"
                                                value={form.remarks}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>
                                </>
                                )}
                                { form.status !== '' && form.status === 1 && (
                                <div className="col-md-2 offset-5">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckIcon />}
                                        onClick={handleSubmit}
                                    >Approve</Button>
                                </div>
                                )}
                                { form.status !== '' && form.status === 2 && (
                                <div className="col-md-2 offset-5">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={handleSubmit}
                                    >Return</Button>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuretyVerify