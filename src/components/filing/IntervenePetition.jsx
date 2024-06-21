import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode, getDistrictsStatus } from '../../redux/features/DistrictSlice'
import { getEstablishmentByDistrict, getEstablishmentsStatus } from '../../redux/features/EstablishmentSlice'
import { getCourtTypes } from '../../redux/features/CourtTypeSlice'
import { getBenchTypes, getBenchTypeStatus } from '../../redux/features/BenchTypeSlice'
import CaseDetails from './CaseDetails'

const IntervenePetition = () => {

    const dispatch              = useDispatch()
    const stateStatus           = useSelector(getStatesStatus)
    const districtStatus        = useSelector(getDistrictsStatus)
    const establishmentStatus   = useSelector(getEstablishmentsStatus)
    // const courtTypeStatus    = useSelector(getCourtTypeStatus)
    const benchTypeStatus       = useSelector(getBenchTypeStatus)


    const initialState = {
        court_type: '',
        bench_type: '',
        state: '',
        district: '',
        establishment: '',
        court: ''
    }
    const[form, setForm] = useState(initialState)
    
    // useEffect(() => {
    //     if(courtTypeStatus === 'idle'){
    //         dispatch(getCourtTypes())
    //     }
    // },[courtTypeStatus, dispatch])


    useEffect(() => {
        if(benchTypeStatus === 'idle'){
            dispatch(getBenchTypes())
        }
    }, [benchTypeStatus, dispatch])


    useEffect(() => {
        if(stateStatus === 'idle'){
            dispatch(getStates())
        }
    },[stateStatus, dispatch])


    useEffect(() => {
        if(districtStatus === 'idle' && form.state !== ''){
            dispatch(getDistrictByStateCode(form.state))
        }
    },[form.state, districtStatus, dispatch])


    useEffect(() => {
        if(establishmentStatus === 'idle' && form.district !== ''){
            dispatch(getEstablishmentByDistrict(form.district))
        }
    }, [form.district, establishmentStatus, dispatch])


    return (
        <>
            <div className="container my-5">
                    <CaseDetails />
                {/* <div className="row">
                    <div className="col-md-6 offset-3">
                        <Form.Group className="row mb-3">
                            <Form.Label className="col-sm-3">Case Number</Form.Label>
                            <div className="col sm-9">
                                <Form.Control></Form.Control>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-6 offset-3 text-center">
                        <p className="text-danger">Or</p>
                    </div>
                    <div className="col-md-6 offset-3">
                        <Form.Group className="row mb-3">
                            <Form.Label className="col-sm-3">Court Type</Form.Label>
                            <div className="col-sm-9">
                                <select 
                                    name="courtType" 
                                    id="court_type" 
                                    className="form-control " 
                                    value={form.court_type} 
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                >
                                    { courttypes.map((type, index) => (
                                        <option key={index} value={type.id}>{type.court_type}</option>
                                    ))}
                                </select>
                            </div>
                        </Form.Group>
                        <Form.Group className='row mb-3'>
                            <Form.Label className="col-sm-3">Bench Type</Form.Label>
                            <div className="col-sm-9">
                                <select 
                                    name="courtBench" 
                                    className="form-control"
                                    value={form.courtBench}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select bench</option>
                                    { benchtypes.map((bench, index) => (
                                        <option key={index} value={bench.id}>{ bench.bench_type}</option>
                                    ))}
                                </select>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="state" className="col-sm-4">State</label>
                            <div className="col-sm-8">
                                <select 
                                    name="state" 
                                    className="form-control" 
                                    value={form.state} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}>
                                    <option value="">Select state</option>
                                    { states.map( (item, index) => (
                                        <option key={index} value={item.state_code}>{item.state_name}</option>)
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="district" className="col-sm-4">District</label>
                            <div className="col-sm-8">
                                <select 
                                    name="district" 
                                    className="form-control"
                                    value={form.district}
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                >
                                    <option value="">Select district</option>
                                    { districts.map( (item, index) => (
                                        <option key={index} value={item.district_code}>{item.district_name}</option>)
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="establishment" className="col-md-3">Establishment Name</label>
                            <div className="col-sm-9">
                                <select 
                                    name="establishment" 
                                    id="establishment" 
                                    className="form-control"
                                    value={form.establishment}
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                >Case
                                    <option value="">Select Establishment</option>
                                    { establishments.map((item, index) => (
                                    <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="court" className="col-sm-3">Court Name</label>
                            <div className="col-sm-9">
                                <select 
                                    name="court" 
                                    id="court" 
                                    className="form-control"
                                    value={form.court}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select court</option>
                                    { courts.map((item, index) => (
                                        <option key={index} value={item.court_code}>{ item.court_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>         
        </>
    )
}

export default IntervenePetition;