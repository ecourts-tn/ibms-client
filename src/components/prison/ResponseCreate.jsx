import React from 'react'
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';

import Button from '@mui/material/Button'
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify';
import Document from './Document';
import BasicDetails from 'components/court/scrutiny/BasicDetails';

const ResponseCreate = () => {
    const {state} = useLocation()
    const[petition, setPetition] = useState({
        filing_type: {}
    })
    const[accused, setAccused] = useState([])
    const[proceeding, setProceeding] = useState({})
    const[crime, setCrime] = useState({})
    const[order, setOrder] = useState({})
    const initialState = {
        is_released: false,
        released_time: '',
        remarks: ''
    }
    
    const[form, setForm] = useState(initialState)

    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`prison/filing/detail/`, {params:{efile_no:state.efile_no}})
            if(response.status === 200){
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_no
                })
                setPetition(response.data.petition)
                setAccused(response.data.litigant)
                setProceeding(response.data.proceeding)
                setOrder(response.data.order)
                setCrime(response.data.crime)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await api.post("bail/prison/response/create/", form)
            if(response.status === 201){
                toast.success("Response added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }
    }

    const doNothing = () => {

    }

    return (
    <>
        <ToastContainer />
        <div className="content-wrapper">
        <div className="container-fluid mt-3">
            <div className="card card-outline card-primary">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Prison Response</strong></h3>
                </div>
                <div className="card-body">
                    
                    <div id="accordion">
                        <div className="card m-1">
                            <div className="card-header" id="headingOne">
                                <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">Petition Details</a>
                            </div>
                            <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                <div className="container-fluid my-2">
                                    <BasicDetails petition={petition} crime={crime}/>
                                </div>
                            </div>
                        </div>
                        <div className="card m-1">
                            <div className="card-header" id="headingTwo">
                                <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">Court Proceedings</a>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                ...
                            </div>
                        </div>
                        <div className="card m-1">
                            <div className="card-header" id="headingThree">
                                <a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" href="/#">
                                    Orders
                                </a>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                ...
                            </div>
                        </div>
                        <div className="card m-1">
                            <div className="card-header" id="headingFour">
                                <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseTwo" href="/#">
                                    Bail Bond
                                </a>
                            </div>
                            <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                ...
                            </div>
                        </div>
                        <div className="card m-1">
                            <div className="card-header" id="headingFive">
                                <a data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                    Prison Remarks
                                </a>
                            </div>
                            <div id="collapseFive" className="collapse show" aria-labelledby="headingFive" data-parent="#accordion">
                                <div className="col-md-8 my-3">
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Accused Released?</label>
                                        <div className="col-sm-8">
                                            <div className="icheck-success d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioPrimary1" 
                                                    name="is_released" 
                                                    checked={form.is_released ? true : null } 
                                                    onChange={(e) =>setForm({...form, [e.target.name]: true})}
                                                />
                                                <label htmlFor="radioPrimary1">Yes</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioPrimary2" 
                                                    name="is_released" 
                                                    checked={!form.is_released ? true : null } 
                                                    onChange={(e) => setForm({...form, [e.target.name]: false})}
                                                />
                                                <label htmlFor="radioPrimary2">No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Date & Time of Release</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Remarks</label>
                                        <div className="col-sm-8">
                                            <textarea name="remarks"cols="30" rows="5" className="form-control"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <Document />
                                    <div className="pb-3">
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
        </div>          
    </>
  )
}

export default ResponseCreate