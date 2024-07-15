import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getCaseTypeStatus,getCaseTypes } from '../../../redux/features/CaseTypeSlice';
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'

const RegistrationSearch = () => {
    const dispatch = useDispatch()
    const casetypes = useSelector((state) => state.casetypes.casetypes)
    const caseTypeStatus    = useSelector(getCaseTypeStatus)

    const[form, setForm] = useState({
        case_type: '',
        reg_number: '',
        reg_year: ''
    })

    useEffect(() => {
        if(caseTypeStatus === 'idle'){
          dispatch(getCaseTypes())
        }
    }, [caseTypeStatus, dispatch])

    return (
        <>
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Status</a></li>
                                <li className="breadcrumb-item active"><a href="#">Registration Number</a></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8 offset-2">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="case_type">Case Type</label>
                                        <select name="case_type" id="case_type" className="form-control">
                                            <option value="">Select case type</option>
                                        { casetypes.map((type, index) => (
                                            <option value={type.type_code} key={index}>{type.type_full_form}</option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="reg_number"
                                                label="Reg. Number"
                                                value={form.reg_number}
                                                size="small"
                                                onChange={(e) => setForm({...form, reg_number:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="reg_year"
                                                label="Reg. Year"
                                                value={form.reg_year}
                                                size="small"
                                                onChange={(e) => setForm({...form, reg_year:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-3">
                                        <Button 
                                            variant='contained'
                                            color="primary"
                                            endIcon={<SearchIcon />}
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