import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'

const ConditionForm = () => {

    const initialState = {
        crime_number: '',
        crime_year: '',
        accused_name:'',
        condition_from:'',
        condition_to:'',
        condition_time:'',
        is_present:false,
        is_fingerprint:false
    }
    const[form, setForm] = useState(initialState)

    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Condition</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Crime Number</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="text"
                                            name="crime_number" 
                                            className="form-control"
                                            value={form.crime_number}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Accused Name</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="text"
                                            name="accused_name" 
                                            className="form-control"
                                            value={form.accused_name}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Condition From</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="condition_from"
                                            value={form.condition_from}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Condition To</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="condition_to"
                                            value={form.condition_to}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}  
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Condition Time</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="condition_time"
                                            value={form.condition_time}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}  
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Present</label>
                                    <div className="col-sm-6">
                                        <div class="icheck-primary d-inline">
                                            <input 
                                                type="checkbox" 
                                                id="isPresentCheckbox" 
                                                name="is_present"
                                                value={form.is_present} 
                                                checked={form.is_present}
                                                onChange={(e) => setForm({...form, [e.target.name]: !form.is_present})}
                                            />
                                            <label for="isPresentCheckbox">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Capture Fingerprint</label>
                                    <div className="col-sm-6">
                                        <div class="icheck-primary d-inline">
                                            <input 
                                                type="checkbox" 
                                                id="fingerprintCheckbox" 
                                                name="is_fingerprint"
                                                value={form.is_fingerprint} 
                                                checked={form.is_fingerprint}
                                                onChange={(e) => setForm({...form, [e.target.name]: !form.is_fingerprint})}
                                            />
                                            <label for="fingerprintCheckbox">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-6">
                                        <Button
                                            variant='contained'
                                            color='success'
                                        >Submit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConditionForm