import api from 'api'
import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { useLocation } from 'react-router-dom'
import WebcamCapture from 'components/common/WebCamCapture'
import FingerPrintCapture from 'components/common/FingerPrintCapture'

const ConditionForm = () => {
    const {state} = useLocation()
    const initialState = {
        crime_number: '',
        crime_year: '',
        accused_name:'',
        condition_date: '',
        condition_time:'',
        remarks: '',
        is_present:false,
        is_fingerprint:false,
        is_photo:false
    }
    const[form, setForm] = useState(initialState)
    const [accused, setAccused] = useState([])
    useEffect(() => {
        const fetchDetail = async() =>{
            try{
                const response = await api.get(`litigant/list/`, {params:{efile_no:state.efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((respondent)=> {
                        return respondent.litigant_type === 1
                    })
                    setAccused(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDetail()
    }, [])

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
                                        <select 
                                            name="accused"
                                            className="form-control"
                                        >
                                            <option value="">Select accused</option>
                                            { accused.map((a, index) => (
                                            <option key={index} value={a.litigant_id}>{a.litigant_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Condition Date</label>
                                    <div className="col-sm-6">
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            name="condition_date"
                                            value={form.condition_date}
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
                                    <label htmlFor="" className="col-sm-3">Remarks</label>
                                    <div className="col-sm-6">
                                        <textarea 
                                            rows={3} 
                                            className="form-control"
                                            name="remarks"
                                            value={form.remarks}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}  
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-3">Accused Present?</label>
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
                                { form.is_present && (
                                    <React.Fragment>
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
                                        { form.is_fingerprint && (
                                            <FingerPrintCapture />
                                        )}
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Capture Photo</label>
                                            <div className="col-sm-6">
                                                <div class="icheck-primary d-inline">
                                                    <input 
                                                        type="checkbox" 
                                                        id="photoCheckbox" 
                                                        name="is_photo"
                                                        value={form.is_photo} 
                                                        checked={form.is_photo}
                                                        onChange={(e) => setForm({...form, [e.target.name]: !form.is_photo})}
                                                    />
                                                    <label for="photoCheckbox">
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        { form.is_photo && (
                                            <WebcamCapture />
                                        )}
                                    </React.Fragment>
                                )}                              
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