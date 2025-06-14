import React, {useState, useEffect, useContext} from 'react'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'
import { BaseContext } from 'contexts/BaseContext'


const Advocate = () => {
    const { efileNumber} = useContext(BaseContext)
    const[advocates, setAdvocates] = useState([])
    const[selectedAdvocate, setSelectedAdvocate] = useState(null)
    const {t} = useTranslation()

    async function fetchAdvocates(){
        try{
            const response = await api.get(`case/advocate/`, {params: {efile_no: efileNumber}})
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
    }, [efileNumber])

    const addAdvocate = async (advocate) => {
        try{
            advocate.efile_no = efileNumber
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
        try{
            const response = await api.get(`case/advocate/${advocate.adv_code}/`)
            if(response.status===200){
                setSelectedAdvocate(response.data)
            }
        }catch(error){
            console.error(error)
        }
    }

    const deleteAdvocate = async (advocate) => {
        try {
            // Sending the delete request
            const response = await api.delete(`case/advocate/${advocate.id}/`);
    
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
        <div className="container-fluid">
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
    )
}

export default Advocate


const AdvocateForm = ({setAdvocates, selectedAdvocate}) => {
    const {efileNumber} = useContext(BaseContext)
    const[search, setSearch] = useState('')
    const[searchError, setSearchError] = useState(false)
    const[loading, setLoading] = useState(false)
    const[isSearchComplete, setIsSearchComplete] = useState(false);
    const initialAdvocate = {
        adv_id:'',
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
        adv_mobile: Yup.string().required(t('errors.adv_mobile_required')).matches(/^$d{10}$/, 'Mobile number must be exactly 10 digits'),
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
            const data = {
                petition: efileNumber,
                advocate:advocate.adv_id,
                is_primary:false
            }
            const response = await api.post(`case/advocate/`, data)
            if(response.status === 201){
                setAdvocates(advocates => [...advocates, advocate])
                toast.success(t('alerts.advocate_added'), {
                    theme: "colored"
                })
                setAdvocate(initialAdvocate)
            }
        }catch(error){
            if(error.response?.status === 400){
                console.log(error.response)
                toast.error(error.response.statusText, {theme:"colored"})
            }
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
        setTimeout(() => {})
        try{
            setLoading(true)
            if(search === ''){
                setSearchError(true)
                return
            }
            const response = await api.post("case/adv/search/", {search})
            if(response.status === 200){
                setAdvocate({
                    adv_id: response.data.userlogin,
                    adv_name: response.data.username,
                    adv_email: response.data.email,
                    adv_mobile: response.data.mobile,
                    adv_reg: response.data.adv_reg
                })
                setIsSearchComplete(true);
            }
        }catch(error){
            setAdvocate(initialAdvocate)
            if (error.response?.status === 404) { 
                toast.error("Advocate details not found", { theme: "colored" });
            } else {
                toast.error("An unexpected error occurred", { theme: "colored" });
            }
            setIsSearchComplete(false);
        }finally{
            setLoading(false)
        }
    }


    return (
        <div className="row">
            { loading && <Loading />}
            <ToastContainer />
            <div className="col-md-6 offset-md-3">
                <div className="row my-5">
                    <div className="col-md-9">
                        <input 
                            name="search"
                            type="text" 
                            className={`form-control ${searchError ? 'is-invalid' : null}`}
                            onChange={(e)=>setSearch(e.target.value)}
                            placeholder={`${t('mobile_number')}/${t('email_address')}/${t('enrollment_number')}`}
                        />
                        <div className="invalid-feedback">
                            Please enter Mobile Number/Email Address/Enrolment Number
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button 
                            className="btn btn-primary btn-block"
                            onClick={searchAdvocate}
                        >
                            {t('search')}
                        </button>
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label  className="col-sm-5">{t('adv_name')}</label>
                    <div className="col-sm-7">
                        <input
                            name="adv_name"
                            value={advocate.adv_name}
                            onChange={ handleChange }
                            disabled={ advocate.adv_name }
                            className={`form-control ${errors.adv_name ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">
                            { errors.adv_name }
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-5">{t('enrollment_number')}</label>
                    <div className="col-sm-7">
                        <input
                            name="adv_reg"
                            value={advocate.adv_reg}
                            onChange={ handleChangeAdvReg }
                            disabled={advocate.adv_reg}
                            className={`form-control ${errors.adv_reg ? 'is-invalid' : ''}`}
                            placeholder='MS/----/----'
                        />
                        <div className="invalid-feedback">
                            { errors.adv_reg }
                        </div>
                    </div>
                </div>
                <div  className="row mb-3">
                    <label className="col-sm-5">{t('mobile_number')}</label>
                    <div className="col-sm-7">
                        <input
                            name="adv_mobile"
                            value={advocate.adv_mobile}
                            onChange={ handleChangeMobile }
                            disabled={advocate.adv_mobile}
                            className={`form-control ${errors.adv_mobile ? 'is-invalid' : ''}`}
                            type="tel"
                        />
                        <div className="invalid-feedback">
                            {errors.adv_mobile || "Mobile number must be 10 digits."}
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-5">{t('email_address')}</label>
                    <div className="col-sm-7">
                        <input
                            name="adv_email"
                            value={advocate.adv_email}
                            onChange={ handleChangeEmail }
                            disabled={advocate.adv_email}
                            className={`form-control ${errors.adv_email ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">
                                {errors.adv_email || "Please provide a valid email address."}   
                        </div>
                        </div>
                </div>
            </div>
            <div className="col-md-12 mb-3 d-flex justify-content-center">
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={!isSearchComplete || !advocate.adv_name || !advocate.adv_email || !advocate.adv_mobile || !advocate.adv_reg}
                ><i className="fa fa-plus mr-2"></i>{t('add_advocate')}</Button>
            </div>
        </div>
    )
}


const AdvocateList = ({advocates, deleteAdvocate, editAdvocate}) => {
    const {t} = useTranslation()
    return (
    <>
      <div className="table-responsive">
      <table className="table table-striped table-bordered table-sm">
            <thead>
              <tr className="bg-info">
                <td>{t('sl_no')}</td>
                <th>{t('adv_name')}</th>
                <th>{t('enrollment_number')}</th>
                <th>{t('mobile_number')}</th>
                <th>{t('email_address')}</th>
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              { advocates.map((a, index) => (
                <tr key={a.id}>
                  <td>{ index+1 }</td>
                  <td>{ a.advocate?.username }</td>
                  <td>{ a.advocate?.adv_reg }</td>
                  <td>{ a.advocate?.mobile }</td>
                  <td>{ a.advocate?.email }</td>
                  <td>
                    { !a.is_primary && (
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          className='ml-1'
                          onClick={()=> deleteAdvocate(a)}
                        >Remove</Button>
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
