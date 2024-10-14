import React, {useState, useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'


const Advocate = () => {
    
    const[advocates, setAdvocates] = useState([])
    const {t} = useTranslation()
    useEffect(() => {
        async function fetchAdvocates(){
            try{
                const efile_no = sessionStorage.getItem("efile_no")
                const response = await api.get(`advocate/list/`, {params: {efile_no}})
                if(response.status === 200){
                    setAdvocates(response.data)
                }
                console.log(response.data)
            }catch(error){
                console.log(error)
            }
        }
        fetchAdvocates();
    }, [])

    const addAdvocate = async (advocate) => {
        try{
            const efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`advocate/create/`, advocate, {params:{efile_no}})
            if(response.status === 201){
                setAdvocates(advocates => [...advocates, advocate])
                toast.success("Advocate details added successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }
    
    const deleteAdvocate = async (advocate) => {
        const newAdvocate = advocates.filter((a) => {
            return a.id !== advocate.id
        })
        const response = await api.delete(`advocate/${advocate.adv_code}/delete/`) 
        if(response.status === 200){
            toast.success("Advocate details deleted successfully", {
                theme:"colored"
            })
            setAdvocates(newAdvocate)
        }
        
        toast.error("Advocate details deleted successfully", {
            theme:"colored"
        })
        setAdvocates(newAdvocate)
    }

    
    return (
        <div className="container">
            {/* <div className="card card-outline card-info">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-graduation-cap mr-2"></i><strong>Advocate Details</strong></h3>
                </div>
                <div className="card-body"> */}
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="my-5">
                                <AdvocateList 
                                    advocates={advocates}
                                    deleteAdvocate={deleteAdvocate}
                                />
                            </div>
                        </div>
                    </div>
                    <AdvocateForm 
                        addAdvocate={addAdvocate}
                        setAdvocates={setAdvocates}
                        advocates={advocates}
                    />
                </div>
        //     </div>
        // </div>
    )
}

export default Advocate


const AdvocateForm = ({setAdvocates}) => {
    const initialAdvocate = {
        adv_name: '',
        adv_email: '',
        adv_mobile: '',
        adv_reg: '',
        is_primary: false
    }
    const[advocate, setAdvocate] = useState(initialAdvocate)
    const[errors, setErrors] = useState({})
    const {t} = useTranslation()
    const validationSchema = Yup.object({
        adv_name: Yup.string().required(),
        adv_email: Yup.string().email().required(),
        adv_mobile: Yup.string().required(),
        adv_reg: Yup.string().required()
    })


    const handleChange = (e) => {
        const {name, value} = e.target
        setAdvocate({...advocate, [name]: value})
    }

    const handleSubmit = async() => {
        try{
            await validationSchema.validate(advocate, { abortEarly:false})
            const efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`advocate/create/`, advocate, {params:{efile_no}})
            if(response.status === 201){
                setAdvocates(advocates => [...advocates, advocate])
                toast.success("Advocate details added successfully", {
                    theme: "colored"
                })
                setAdvocate(initialAdvocate)
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
            <div className="row">
                {/* <div className="col-md-4 offset-md-4 mb-3">
                    <select name="" className='form-control'>
                        <option value="">Test</option>
                    </select>
                </div> */}
                <div className="col-md-6 offset-md-3">
                    <Form.Group className="row mb-3">
                        <Form.Label  className="col-sm-3">{t('adv_name')}</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="adv_name"
                                value={advocate.adv_name}
                                onChange={ handleChange }
                                className={`${errors.adv_name ? 'is-invalid' : ''}`}
                            ></Form.Control>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-3">{t('enrollment_number')}</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="adv_reg"
                                value={advocate.adv_reg}
                                onChange={ handleChange }
                                className={`${errors.adv_reg ? 'is-invalid' : ''}`}
                                placeholder='MS/----/----'
                            ></Form.Control>
                            <div className="invalid-feedback">
                                { errors.adv_reg }
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group  className="row mb-3">
                        <Form.Label className="col-sm-3">{t('mobile_number')}</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="adv_mobile"
                                value={advocate.adv_mobile}
                                onChange={ handleChange }
                                className={`${errors.adv_mobile ? 'is-invalid' : ''}`}
                            ></Form.Control>
                            <div className="invalid-feedback">
                                { errors.adv_mobile }
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-3">{t('email_address')}</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="adv_email"
                                value={advocate.adv_email}
                                onChange={ handleChange }
                                className={`${errors.adv_email ? 'is-invalid' : ''}`}
                            ></Form.Control>
                            <div className="invalid-feedback">
                                { errors.adv_email }
                            </div>
                         </div>
                    </Form.Group>
                </div>
                <div className="col-md-12 mb-3 d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                    ><i className="fa fa-plus mr-2"></i>{t('add_advocate')}</Button>
                </div>
            </div>
        </>
    )
}


const AdvocateList = ({advocates, deleteAdvocate}) => {
    const {t} = useTranslation()
    return (
    <>
      <div className="table-responsive">
      <table className="table table-striped table-bordered table-sm">
            <thead className="bg-secondary">
              <tr>
                <td>{t('sl_no')}</td>
                <th>{t('adv_name')}</th>
                <th>{t('enrollment_number')}</th>
                <th>{t('mobile_number')}</th>
                <th>{t('email_address')}</th>
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              { advocates.map((advocate, index) => (
                <tr key={index}>
                  <td>{ index+1 }</td>
                  <td>{ advocate.adv_name }</td>
                  <td>{ advocate.adv_reg }</td>
                  <td>{ advocate.adv_mobile }</td>
                  <td>{ advocate.adv_email }</td>
                  <td>
                    { !advocate.is_primary && (
                      <>
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          onClick={() => deleteAdvocate(advocate)}
                        >Edit</Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          className='ml-1'
                          onClick={()=> deleteAdvocate(advocate)}
                        >Delete</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
    )
}
