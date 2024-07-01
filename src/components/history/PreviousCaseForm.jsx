import React, {useState, useEffect} from 'react'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'

const PreviousCaseForm = () => {

    const initialState = {
        prev_case_number: null,
        prev_case_year: null,
        prev_case_status: '',
        prev_disposal_date: null,
        prev_proceedings: '',
        prev_is_correct: false,
        prev_remarks: '',
        prev_is_pending: false
    }

    const[petition, setPetition] = useState(initialState)

    const[petitions, setPetitions] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get('api/bail/petition/TN20240624000002/previous-history/')
                if(response.status === 200){
                    setPetitions(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    const handleSubmit = async (e) => {
        try{
            const cino = localStorage.getItem("cino")
            const response = await api.put(`api/bail/filing/${cino}/update/`, petition)
            if(response.status === 200){
                toast.success("Previous case details updated successfully", {
                    theme:"colored"
                })
            }
            setPetition(initialState)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-info"><strong>Previous Application Filed</strong></div>
                </div>
                { Object.keys(petitions).length > 0 && (
                    <>
                    <table className="table table-bordered table-striped table-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Case Number</th>
                                <th>Petitioner Name</th>
                                <th>Court Details</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Order Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            { petitions.map((petition, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{petition.filing_type.type_name}/{petition.filing_number}/{petition.filing_year}</td>
                                <td></td>
                                <td>{ petition.court.court_name}, {petition.establishment.establishment_name}, {petition.district.district_name}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </>
                )}
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Case Number</label>
                        <input 
                            type="text" 
                            name="prev_case_number" 
                            className="form-control"
                            value={petition.prev_case_number}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Year</label>
                        <input 
                            type="text" 
                            name="prev_case_year" 
                            className="form-control"
                            value={petition.prev_case_year}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">Status</label>
                        <input 
                            type="text" 
                            name="prev_case_status" 
                            className="form-control"
                            value={petition.prev_case_status}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">Date of Disposal</label>
                        <input 
                            type="date" 
                            name="prev_disposal_date" 
                            className="form-control"
                            value={petition.prev_disposal_date}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label htmlFor="">Proceeding</label>
                        <textarea 
                            name="prev_proceedings" 
                            className="form-control" 
                            rows="3"
                            value={petition.prev_proceedings}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <div className="form-group">
                        <label>Are the above case details correct?</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_correct ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:1})} 
                        />
                        <label htmlFor="details_correct_yes" className="ml-1">Yes</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_no" 
                            value="no" 
                            className="ml-3"
                            checked={!petition.prev_is_correct ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:2})} 
                        />
                        <label htmlFor="details_correct_no" className="ml-1">No</label>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label htmlFor="remarks">Remarks:</label>
                        <textarea 
                            name="prev_remarks" 
                            className="form-control" 
                            rows="3"
                            value={petition.prev_remarks}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="previous_bail_application">Any Previous Bail Application Pending?</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_pending ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:1})} 
                        />
                        <label htmlFor="previous_bail_yes" className="ml-1">Yes</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_no" 
                            value="no" 
                            className="ml-3" 
                            checked={!petition.prev_is_pending ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:2})} 
                        />
                        <label htmlFor="previous_bail_no" className="ml-1">No</label>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                        >Submit</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PreviousCaseForm