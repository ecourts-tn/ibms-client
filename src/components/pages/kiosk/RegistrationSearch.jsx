import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getCaseTypeStatus,getCaseTypes } from '../../../redux/features/CaseTypeSlice';
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from '../../../api';
import { toast, ToastContainer } from 'react-toastify';

const RegistrationSearch = () => {
    const dispatch = useDispatch()
    const casetypes = useSelector((state) => state.casetypes.casetypes)
    const caseTypeStatus    = useSelector(getCaseTypeStatus)
    const[petition, setPetition] = useState({})
    const[form, setForm] = useState({
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const[errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        reg_number: Yup.number().typeError('This field should be a number').required(),
        reg_year: Yup.number().typeError('This field should be a number').required()
    })
    useEffect(() => {
        if(caseTypeStatus === 'idle'){
          dispatch(getCaseTypes())
        }
    }, [caseTypeStatus, dispatch])

    const handleSubmit = async () => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const {response} = await api.post("api/case/search/registration-number/", form)
            if(response.status === 200){
                setPetition(response.data)
            }
            if(response.status === 404){
                toast.error(response.data.message, {theme:"colored"})
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">Home</li>
                                <li className="breadcrumb-item text-primary">Status</li>
                                <li className="breadcrumb-item active">Registration Number</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8 offset-2">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="case_type">Case Type</label>
                                        <select 
                                            name="case_type" 
                                            id="case_type" 
                                            className={`form-control ${errors.case_type ? 'is-invalid' : null}`}
                                            onChange={(e)=> setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select case type</option>
                                            { casetypes.map((type, index) => (
                                            <option value={type.type_code} key={index}>{type.type_full_form}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.case_type }
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                error={errors.reg_number ? true : false }
                                                name="reg_number"
                                                label="Reg. Number"
                                                value={form.reg_number}
                                                size="small"
                                                onChange={(e) => setForm({...form, reg_number:e.target.value})}
                                                helperText={errors.reg_number}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                error={errors.reg_year ? true : null}
                                                name="reg_year"
                                                label="Reg. Year"
                                                value={form.reg_year}
                                                size="small"
                                                helperText={errors.reg_year}
                                                onChange={(e) => setForm({...form, reg_year:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-3">
                                        <Button 
                                            variant='contained'
                                            color="primary"
                                            endIcon={<SearchIcon />}
                                            onClick={handleSubmit}
                                        >
                                            Search
                                        </Button>
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

export default RegistrationSearch