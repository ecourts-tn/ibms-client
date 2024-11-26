import React, {useState, useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import Loading from 'components/Loading'


const Advocate = () => {
    
    const[advocates, setAdvocates] = useState([])
    const[selectedAdvocate, setSelectedAdvocate] = useState(null)
    const {t} = useTranslation()

    async function fetchAdvocates(){
        try{
            const efile_no = sessionStorage.getItem("efile_no")
            const response = await api.get(`case/advocate/`, {params: {efile_no}})
            if(response.status === 200){
                setAdvocates(response.data)
            }
            console.log(response.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAdvocates();
    }, [])

    const addAdvocate = async (advocate) => {
        try{
            advocate.efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`case/advocate/`, advocate)
            if(response.status === 201){
                fetchAdvocates();
                // setAdvocates(advocates => [...advocates, advocate])
                toast.success(t('alerts.advocate_added'), {
                    theme: "colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    const editAdvocate = async(advocate) => {
        console.log(advocate.adv_code)
        try{
            const response = await api.get(`case/advocate/${advocate.adv_code}/`)
            if(response.status===200){
                setSelectedAdvocate(response.data)
            }
        }catch(error){
            console.error(error)
        }
    }

    
    // const deleteAdvocate = async (advocate) => {
    //     const newAdvocate = advocates.filter((a) => {
    //         return a.id !== advocate.id
    //     })
    //     const response = await api.delete(`case/advocate/${advocate.adv_code}/`) 
    //     if(response.status === 200){
    //         toast.success(t('alerts.advocate_deleted'), {
    //             theme:"colored"
    //         })
    //         setAdvocates(newAdvocate)
    //     }
        
    //     toast.error(t('alerts.advocate_deleted'), {
    //         theme:"colored"
    //     })
    //     setAdvocates(newAdvocate)
    // }
    const deleteAdvocate = async (advocate) => {
        try {
            // Sending the delete request
            const response = await api.delete(`case/advocate/${advocate.adv_code}/`);
    
            if (response.status === 200 || response.status === 204) {
                // Successfully deleted, update the state
                // const newAdvocateList = advocates.filter((a) => a.id !== advocate.id);
                // setAdvocates(newAdvocateList);  // This triggers a re-render with updated data
                fetchAdvocates();
                toast.success(t('alerts.advocate_deleted'), {
                    theme: "colored",
                });
            } else {
                // If deletion was unsuccessful, handle error
                toast.error(t('alerts.delete_failed'), {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.error("Error deleting advocate:", error);
    
            // If an error occurs, show a failure message
            toast.error(t('alerts.delete_failed'), {
                theme: "colored",
            });
        }
    };
    
    

    
    return (
        <div className="container">
            <div className="card card-outline card-info">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-graduation-cap mr-2"></i><strong>Advocate Details</strong></h3>
                </div>
                <div className="card-body p-2">
                    <div className="row">
                        <div className="col-md-12">
                            <AdvocateList 
                                advocates={advocates}
                                deleteAdvocate={deleteAdvocate}
                                editAdvocate={editAdvocate}
                            />
                        </div>
                    </div>
                    <AdvocateForm 
                        addAdvocate={addAdvocate}
                        setAdvocates={setAdvocates}
                        selectedAdvocate={selectedAdvocate}
                        advocates={advocates}
                    />
                </div>
            </div>
        </div>
    )
}

export default Advocate


const AdvocateForm = ({setAdvocates, selectedAdvocate}) => {
    const[search, setSearch] = useState('')
    const[loading, setLoading] = useState(false)
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
        adv_name: Yup.string().required(t('errors.adv_name_required')),
        adv_email: Yup.string().email().required(t('errors.adv_email_required')),
        adv_mobile: Yup.string().required(t('errors.adv_mobile_required')),
        adv_reg: Yup.string().required(t('errors.adv_reg_required'))
    })


    const handleChange = (e) => {
        const {name, value} = e.target
        setAdvocate({...advocate, [name]: value})
    }

    const handleChangeAdvReg = (e) => {
        let value = e.target.value;
        if (!value.startsWith("MS/")) {
            value = "MS/";
        }
        const parts = value.replace("MS/", "").split("/");
        let firstPart = parts[0]?.replace(/\D/g, ""); // Keep only digits
        if (firstPart.length > 6) firstPart = firstPart.slice(0, 6); // Limit to 6 digits
        let secondPart = parts[1]?.replace(/\D/g, "").slice(0, 4) || "";
        value = `MS/${firstPart}`;
        if (firstPart.length >= 5 || secondPart) {
            value += `/${secondPart}`;
        }
        setAdvocate({ ...advocate, adv_reg: value });
    };
    useEffect(() => {
        setAdvocate((prev) => ({ ...prev, adv_reg: "MS/" }));
    }, []);
    
    const handleChangeMobile = (e) => {
        const { name, value } = e.target;

        if (name === "adv_mobile") {
            // Remove any non-numeric characters
            const numericValue = value.replace(/\D/g, "");
            
            // Limit the value to 10 digits
            if (numericValue.length <= 10) {
                setAdvocate({ ...advocate, [name]: numericValue });
            }
        } else {
            setAdvocate({ ...advocate, [name]: value });
        }
    };
    
    const handleChangeEmail = (e) => {
        const { name, value } = e.target;
    
        if (name === "adv_email") {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
            if (!emailRegex.test(value)) {
                setErrors({ ...errors, adv_email: "Please enter a valid email address." });
            } else {
                setErrors({ ...errors, adv_email: "" });  // Clear the error if valid
            }
        }
    
        setAdvocate({ ...advocate, [name]: value });
    };
    

    useEffect(() => {
        if(selectedAdvocate){
            setAdvocate(selectedAdvocate)
        }
    }, [selectedAdvocate])


    const handleSubmit = async() => {
        try{
            await validationSchema.validate(advocate, { abortEarly:false})
            advocate.efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`case/advocate/`, advocate, )
            if(response.status === 201){
                setAdvocates(advocates => [...advocates, advocate])
                toast.success(t('alerts.advocate_added'), {
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

    const searchAdvocate = async(e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const response = await api.post("case/adv/search/", {params:{search}})
            if(response.status === 200){
                console.log(response.data)
                setAdvocate(response.data)
            }
        }catch(error){
            if(error.response?.stauts === 404){
                toast.error("Advocate details not found", {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }


    return (
        <>
            { loading && <Loading />}
            <ToastContainer />
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="row my-5">
                        <div className="col-md-10">
                            <input 
                                name="search"
                                type="text" 
                                className="form-control" 
                                onChange={(e)=>setSearch(e.target.value)}
                                placeholder={`${t('mobile_number')}/${t('email_address')}/${t('enrollment_number')}`}
                            />
                        </div>
                        <div className="col-md-2">
                            <button 
                                className="btn btn-primary btn-block"
                                onClick={searchAdvocate}
                            >
                                {t('search')}
                            </button>
                        </div>
                    </div>
                    <Form.Group className="row mb-3">
                        <Form.Label  className="col-sm-5">{t('adv_name')}</Form.Label>
                        <div className="col-sm-7">
                            <Form.Control
                                name="adv_name"
                                value={advocate.adv_name}
                                onChange={ handleChange }
                                className={`${errors.adv_name ? 'is-invalid' : ''}`}
                            ></Form.Control>
                            <div className="invalid-feedback">
                                { errors.adv_name }
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-5">{t('enrollment_number')}</Form.Label>
                        <div className="col-sm-7">
                            <Form.Control
                                name="adv_reg"
                                value={advocate.adv_reg}
                                onChange={ handleChangeAdvReg }
                                className={`${errors.adv_reg ? 'is-invalid' : ''}`}
                                placeholder='MS/----/----'
                            ></Form.Control>
                            <div className="invalid-feedback">
                                { errors.adv_reg }
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group  className="row mb-3">
                        <Form.Label className="col-sm-5">{t('mobile_number')}</Form.Label>
                        <div className="col-sm-7">
                            <Form.Control
                                name="adv_mobile"
                                value={advocate.adv_mobile}
                                onChange={ handleChangeMobile }
                                className={`${errors.adv_mobile ? 'is-invalid' : ''}`}
                                type="tel"
                            ></Form.Control>
                            <div className="invalid-feedback">
                                {errors.adv_mobile || "Mobile number must be 10 digits."}
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-5">{t('email_address')}</Form.Label>
                        <div className="col-sm-7">
                            <Form.Control
                                name="adv_email"
                                value={advocate.adv_email}
                                onChange={ handleChangeEmail }
                                className={`${errors.adv_email ? 'is-invalid' : ''}`}
                            ></Form.Control>
                            <div className="invalid-feedback">
                                 {errors.adv_email || "Please provide a valid email address."}   
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


const AdvocateList = ({advocates, deleteAdvocate, editAdvocate}) => {
    const {t} = useTranslation()
    return (
    <>
      <div className="table-responsive">
      <table className="table table-striped table-bordered">
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
                <tr key={advocate.id}>
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
                          onClick={() => editAdvocate(advocate)}
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
