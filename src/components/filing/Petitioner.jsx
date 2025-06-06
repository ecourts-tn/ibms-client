import React, { useState, useEffect, useContext} from 'react'
import PetitionerForm from './PetitionerForm'
import PetitionerList from './PetitionerList'
import {toast} from 'react-toastify'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { BaseContext } from 'contexts/BaseContext'

const Petitioner = () => {
    const {efileNumber} = useContext(BaseContext)
    const [petitioners, setPetitioners] = useState([])
    const [selectedPetitioner, setSelectedPetitioner] = useState(null)
    const {t} = useTranslation()
    
    
    useEffect(() => {
        const fetchPetitioners = async() => {
            try{
                const response = await api.get("litigant/list/", {params:{efile_no:efileNumber}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((petitioner)=> {
                        return petitioner.litigant_type === 1
                    })
                    setPetitioners(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efileNumber){
            fetchPetitioners()
        }
    },[])

    const addPetitioner = async(litigant) => {
        if(efileNumber){
            try{
                litigant.efile_no = efileNumber;
                const response = await api.post(`litigant/create/`, litigant, {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if(response.status === 201){
                    setPetitioners(petitioners => [...petitioners, litigant])
                    toast.success(t('alerts.petitioner_added'), {
                        theme:"colored"
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
    }

    const editPetitioner = async(litigant_id) => {
        try{
            const response = await api.get(`litigant/${litigant_id}/read/`)
            setSelectedPetitioner(response.data)
        }catch(error){
            console.log(error)
        }

    }

    const deletePetitioner =async(petitioner) => {
        const newPetitioners = petitioners.filter((p) => {
            return p.litigant_id !== petitioner.litigant_id
        })
        try{
            if(window.confirm("Are you sure want to delete the litigant")){
                const response = await api.delete(`litigant/${petitioner.litigant_id}/delete/`)
                // if(response.status === 204){
                    setPetitioners(newPetitioners)
                    toast.error(t('alerts.petitioner_deleted'), {
                        theme: "colored"
                    }) 
                // }
            }
        }catch(error){
            console.log(error)
        }
    }
     
    return (
        <div className="container-fluid mt-4">
            <PetitionerList 
                petitioners={petitioners} 
                deletePetitioner={deletePetitioner} 
                editPetitioner={editPetitioner}
            />
            <PetitionerForm 
                addPetitioner={addPetitioner} 
                petitioners={petitioners} 
                selectedPetitioner={selectedPetitioner}
            />
        </div>
    )
}

export default Petitioner