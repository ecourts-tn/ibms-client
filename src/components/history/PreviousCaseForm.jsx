import React, {useState, useEffect} from 'react'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'


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

    const[history, setHistory] = useState([])
    const {t} = useTranslation()

    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        async function fetchData(){
            try{
                const response = await api.get('case/crime/history/',{params: {efile_no}})
                if(response.status === 200){
                    console.log(response.data)
                    setHistory(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    const handleSubmit = async (e) => {
        try{
            const cino = sessionStorage.getItem("efile_no")
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
                    { history.map((item, index) => (
                        <>
                            <table className="table table-bordered table-sm">
                            <tbody>
                                    <tr>
                                        <td colSpan={2} className="text-primary"><strong>{index+1}. ATN20240000001F2024000001</strong></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong className='text-danger'>FIR Details</strong><br></br>
                                            <strong>Crime Number</strong>: {`${item.fir_number}/${item.fir_year}`}  <br/><strong>Police Station</strong>: Sulur, Coimbatore District
                                        </td>
                                        <td>
                                            <strong className="text-danger">Filing Details</strong><br/>
                                            <strong>eFile Number</strong>: ATN20240000001F2024000001<br/>
                                            <strong>eFile Date</strong>: 09-09-2024<br></br>
                                            <strong>Jurisdiction Court</strong>: Principal Court, City Civil Court, Chennai 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            <strong className="text-danger">Business/Order Details</strong><br></br>
                                            <strong>Status</strong>: Pending <br></br>
                                            <strong>Business/Order Date</strong>: 09-09-2024 <br></br>
                                            <strong>Proceeding</strong>: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores esse aliquid necessitatibus, non repellendus et, libero id accusamus repellat voluptatum temporibus. Nobis, quasi a error consectetur enim quos tenetur cumque.
                                        </td>
                                    </tr>
                            </tbody>
                            </table>
                            <table className="table table-bordered table-sm">
                            <tbody>
                                <tr>
                                    <td colSpan={2} className="text-primary"><strong>{index+2}. ATN20240000001F2024000002</strong></td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong className='text-danger'>FIR Details</strong><br></br>
                                        <strong>Crime Number</strong>: {`${item.fir_number}/${item.fir_year}`}  <br/><strong>Police Station</strong>: Sulur, Coimbatore District
                                    </td>
                                    <td>
                                        <strong className="text-danger">Filing Details</strong><br/>
                                        <strong>eFile Number</strong>: ATN20240000001F2024000001<br/>
                                        <strong>eFile Date</strong>: 09-09-2024<br></br>
                                        <strong>Jurisdiction Court</strong>: Principal Court, City Civil Court, Chennai 
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <strong className="text-danger">Business/Order Details</strong><br></br>
                                        <strong>Status</strong>: Pending <br></br>
                                        <strong>Business/Order Date</strong>: 09-09-2024 <br></br>
                                        <strong>Proceeding</strong>: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores esse aliquid necessitatibus, non repellendus et, libero id accusamus repellat voluptatum temporibus. Nobis, quasi a error consectetur enim quos tenetur cumque.
                                    </td>
                                </tr>
                            </tbody>
                            </table>
                        </>
                    ))}
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">{t('case_number')}</label>
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
                        <label htmlFor="">{t('case_year')}</label>
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
                        <label htmlFor="">{t('status')}</label>
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
                        <label htmlFor="">{t('disp_next_date')}</label>
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
                        <label htmlFor="">{t('proceedings')}</label>
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
                        <label>{t('accept_case_detail')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_correct ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:1})} 
                        />
                        <label htmlFor="details_correct_yes" className="ml-1">{t('yes')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_no" 
                            value="no" 
                            className="ml-3"
                            checked={!petition.prev_is_correct ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:2})} 
                        />
                        <label htmlFor="details_correct_no" className="ml-1">{t('no')}</label>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label htmlFor="remarks">{t('remarks')}</label>
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
                        <label htmlFor="previous_bail_application">{t('previous_pending')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_pending ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:1})} 
                        />
                        <label htmlFor="previous_bail_yes" className="ml-1">{t('yes')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_no" 
                            value="no" 
                            className="ml-3" 
                            checked={!petition.prev_is_pending ? true : false }
                            onChange={(e) => setPetition({...petition, [e.target.name]:2})} 
                        />
                        <label htmlFor="previous_bail_no" className="ml-1">{t('no')}</label>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                        >{t('submit')}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PreviousCaseForm