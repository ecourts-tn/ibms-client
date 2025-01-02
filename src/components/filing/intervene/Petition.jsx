import api from 'api';
import * as Yup from 'yup'
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import InitialInput from 'components/filing/intervene/InitialInput'


const Petition = () => {

    const[grounds, setGrounds] = useState([])
    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})
    const {t} = useTranslation()
    const initialState = {
        efile_no: '',
    }

    const[form, setForm] = useState(initialState);
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[searchForm, setSearchForm] = useState({
        case_type:null,
        case_number: undefined,
        case_year: undefined
    })
    const searchSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors]            = useState({})

    const stepperRef = useRef(null);

  

    const handleChange = (e) => {
            const {name, value} = e.target
            setForm({...form, [name]:value})
    }

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

    const deleteRespondent = (respondent) => {
        const newRespondent = respondents.filter((res) => { return res.id !== respondent.id })
        setRespondents(newRespondent)
    }


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted-list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    console.log(cases)

    useEffect(() => {
        async function fetchDetails(){
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:form.efile_no}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                    setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(form.efile_no!== ''){
            fetchDetails()
        }
    },[form.efile_no])

    console.log(petition)
    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("api/bail/petition/detail/", { params: searchForm})
            if(response.status === 200){
                console.log(response.data)
                setForm({...form, cino:response.data.petition.cino})
            }
            if(response.status === 404){
                toast.error("Petition details not found",{
                    theme:"colored"
                })
            }
        }catch(error){
            const newError = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newError[err.path] = err.message
                });
                setSearchErrors(newError)
            }
            if(error){
                toast.error(error.response.message,{
                    theme:"colored"
                })
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("api/bail/surety/create/", form, {
                headers: {
                    'content-type': 'multipart/form-data',
                    // 'X-CSRFTOKEN': CSRF_TOKEN
                  }
            })
            if(response.status === 201){
                toast.success("Petition submitted successfully", {
                    theme:'colored'
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container-fluid px-md-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="">
                            <div id="initial-input" className="">
                                <InitialInput></InitialInput>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Petition;