import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const CNRSearch = () => {

    const[form, setForm] = useState({
        cino: ''
    })
    const[petition, setPetition] = useState({})
    const {t} = useTranslation()
    const [errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        cino: Yup.string().required(t('errors.cnr_required'))
    })



    const handleSubmit = async() => {
        try{
            await  validationSchema.validate(form, {abortEarly:false})
            try{
                const response = await api.post("api/case/search/cnr-number/", {form})
                if(response.status === 200){
                    setPetition(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }catch(error){
            const newErrors = {}
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message
            })
            setErrors(newErrors)
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
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('case_status')}</li>
                                <li className="breadcrumb-item active">{t('cnr_number')}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8">
                                <FormControl fullWidth>
                                    <TextField
                                        name="cino"
                                        label={t('cnr_number')}
                                        value={form.cino}
                                        size="small"
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                        error={ errors.cino ? true : false }
                                        helperText={ errors.cino }
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-4">
                                <Button 
                                    variant='contained'
                                    color="primary"
                                    endIcon={<SearchIcon />}
                                    onClick={handleSubmit}
                                >
                                    {t('search')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default CNRSearch