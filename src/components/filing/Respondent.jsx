import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import RespondentForm from './RespondentForm'
import RespondentList from './RespondentList'
import {toast, ToastContainer} from 'react-toastify'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { BaseContext } from 'contexts/BaseContext'

const Respondent = () => {

    const {efileNumber} = useContext(BaseContext)
    const[respondents, setRespondents] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState(null)
    const {t} = useTranslation()

    useEffect(() => {
        const fetchLitigants =  async() => {
            try{
                const response = await api.get(`litigant/list/`, {params:{efile_no:efileNumber}})
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
        if(efileNumber){
            fetchLitigants();
        }
    },[])

    const addRespondent = async(litigant) => {
        litigant.efile_no = efileNumber
        try{
            const response = await api.post(`litigant/create/`, litigant)
            if(response.status === 201){
                setRespondents(respondents => [...respondents, litigant])
                toast.success(t('alerts.respondent_added'), {
                    theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    const editRespondent = async(litigant_id) => {
        try{
            const response = await api.get(`litigant/${litigant_id}/read/`)
            setSelectedRespondent(response.data)
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
                toast.error(t('alerts.respondent_deleted'), {
                    theme: "colored"
                })
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

export default Respondent