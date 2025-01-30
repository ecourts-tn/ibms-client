import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import RespondentForm from './RespondentForm'
import RespondentList from './RespondentList'
import {toast, ToastContainer} from 'react-toastify'
import api from '../../api'
import { useTranslation } from 'react-i18next'

const RespondentContainer = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[respondents, setRespondents] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState(null)
    const[cirme, setCrime] = useState({})
    const {t} = useTranslation()
    const efile_no = sessionStorage.getItem("efile_no")
    useEffect(() => {
        const fetchLitigants =  async() => {
            try{
                const response = await api.get(`litigant/list/`, {params:{efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((respondent)=> {
                        return respondent.litigant_type === 2
                    })
                    setRespondents(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efile_no){
            fetchLitigants();
        }
    },[])

    const addRespondent = async(litigant) => {
        litigant.efile_no = sessionStorage.getItem("efile_no")
        try{
            const response = await api.post(`litigant/create/`, litigant)
            if(response.status === 201){
                setRespondents(respondents => [...respondents, litigant])
                toast.success(t('alerts.respondent_added').replace('{respondent}', response.data.litigant_id), {
                theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    const editRespondent = async(id) => {
        try{
            const response = await api.get(`litigant/${id}/read/`)
            setSelectedRespondent(response.data)
            handleClose()
        }catch(error){
            console.log(error)
        }

    }

    const deleteRespondent =async (respondent) => {
        const newRespondents = respondents.filter((p) => {
            return p.litigant_id !== respondent.litigant_id
        })
        try{
            if(window.confirm("Are you sure want to delete the litigant")){
                const response = await api.delete(`litigant/${respondent.litigant_id}/delete/`)
                setRespondents(newRespondents)
                toast.error(t('alerts.respondent_deleted').replace('{respondent}', respondent.litigant_id), {
                    theme: "colored"
                })
                handleClose()
            }
        }catch(error){
            console.log(error)
        }
    }
     
    return (
        <div className='container-fluid'>
            {respondents.length > 0 && (
                <RespondentList 
                    respondents={respondents}
                    deleteRespondent={deleteRespondent}
                    editRespondent={editRespondent}
                />
            )}
            <RespondentForm 
                addRespondent={addRespondent}
                selectedRespondent={selectedRespondent}
            />
        </div>
    )
}

export default RespondentContainer