import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import Document from '../prosecutor/Document'

const PPRemarks = ({accused}) => {

    console.log(accused)
    const initialState = {
        response_type: '',
        accused_name: '',
        accused_type: '',
        discharged: false,
    }
    const[form, setForm] = useState(initialState)

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    
    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-10">
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
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Remarks</label>
                            <div className="col-sm-8">
                                <textarea 
                                    name="remarks" 
                                    rows="3" 
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
        </>
    )
}

export default PPRemarks