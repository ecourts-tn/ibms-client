import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from '../../../api'
import { toast, ToastContainer } from 'react-toastify'


const FIRSearch = () => {

    const[form, setForm] = useState({
        fir_number:'',
        fir_year:''
    })
    const[errors, setErrors] = useState({})
    const[petition, setPetition] = useState({})
    const validationSchema = Yup.object({
        fir_number: Yup.number().typeError("This field should be numeric").required(),
        fir_year:   Yup.number().typeError("This field should be numeric").required()
    })
    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, { abortEarly: false})
            const {response} = await api.post("api/case/search/fir-number/", form)
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
                                <li className="breadcrumb-item active">FIR Number</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8 offset-2">
                                <div className="row">
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                error={errors.fir_number ? true : false}
                                                name="fir_number"
                                                label="FIR Number"
                                                value={form.fir_number}
                                                size="small"
                                                helperText={errors.fir_number}
                                                onChange={(e) => setForm({...form, fir_number:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="fir_year"
                                                error={errors.fir_year ? true : false }
                                                label="FIR Year"
                                                value={form.fir_year}
                                                size="small"
                                                helperText={errors.fir_year}
                                                onChange={(e) => setForm({...form, fir_year:e.target.value})}
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

export default FIRSearch