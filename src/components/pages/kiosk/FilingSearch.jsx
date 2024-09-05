import React, {useState, useContext} from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from '../../../api'
import { toast, ToastContainer } from 'react-toastify'
import { BaseContext } from '../../../contexts/BaseContext'

const FilingSearch = () => {

    const {states, districts, establishments} = useContext(BaseContext)

    console.log(states)

    const[form, setForm] = useState({
        state: '', 
        district: '',
        establishment: '',
        filing_number:'',
        filing_year:'',
    })
    const[errors, setErrors] = useState({})
    const[petition, setPetition] = useState({})
    const validationSchema = Yup.object({
        filing_number: Yup.number().typeError('This field should be a number').required(),
        filing_year: Yup.number().typeError('This field should be a number').required()
    })
    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const {response} = await api.post("api/case/search/filing-number/", form)
            if(response.status === 200){
                setPetition(response.data)
            }
            if(response.status === 404){
               toast.error(response.data.message, { theme: "colored" })
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
                                <li className="breadcrumb-item active">Filing Number</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">State</label>
                                            <select 
                                                name="state" 
                                                className="form-control"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select state</option>
                                                { states.map((state, index) => (
                                                <option value={state.state_code} key={index}>{state.state_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">District</label>
                                            <select 
                                                name="district" 
                                                className="form-control"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select district</option>
                                                { districts.filter(district => parseInt(district.state) === parseInt(form.state)).map((district, index) => (
                                                    <option value={district.district_code} key={index}>{district.district_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">Establishment</label>
                                            <select 
                                                name="establishment" 
                                                className="form-control"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select establishment</option>
                                                {establishments.filter(est=>parseInt(est.district) === parseInt(form.district)).map((estd, index)=>(
                                                    <option key={index} value={estd.establishment_code}>{estd.establishment_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="filing_number"
                                                label="Filing Number"
                                                error={errors.filing_number ? true : false }
                                                className={`form-control ${errors.filing_number ? 'is-invalid' : null }`}
                                                value={form.filing_number}
                                                size="small"
                                                onChange={(e) => setForm({...form, filing_number:e.target.value})}
                                                helperText={errors.filing_number}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="filing_year"
                                                error={errors.filing_year ? true : false }
                                                label="Filing Year"
                                                value={form.filing_year}
                                                size="small"
                                                onChange={(e) => setForm({...form, filing_year:e.target.value})}
                                                helperText={errors.filing_year}
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

export default FilingSearch