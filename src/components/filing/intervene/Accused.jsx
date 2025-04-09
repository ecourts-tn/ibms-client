import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { RequiredField } from 'utils';
import * as Yup from 'yup'
import api from 'api';
import { BaseContext } from  'contexts/BaseContext';
import { useTranslation } from 'react-i18next';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import { MasterContext } from 'contexts/MasterContext';
import { LanguageContext } from 'contexts/LanguageContex';
import AccusedList from 'components/filing/intervene/AccusedList'
import AccusedForm from 'components/filing/intervene/AccusedForm'


const Accused = () => {
  const {efileNumber} = useContext(BaseContext)
  const [accused, setAccused] = useState([])
  const [selectedAccused, setSelectedAccused] = useState(null)
  const {t} = useTranslation()  
  
  useEffect(() => {
      const fetchAccused = async() => {
          try{
              const response = await api.get("litigant/list/", {params:{efile_no:efileNumber}})
              if(response.status === 200){
                  const filtered_data = response.data.filter((accused)=> {
                      return accused.litigant_type === 3
                  })
                  setAccused(filtered_data)
              }
          }catch(error){
              console.error(error)
          }
      }
      if(efileNumber){
          fetchAccused()
      }
  },[])

  const addAccused = async(accused) => {
      if(efileNumber){
          try{
              accused.efile_no = efileNumber;
              const response = await api.post(`litigant/create/`, accused, {
                  headers:{
                      'Content-Type': 'multipart/form-data',
                  }
              })
              if(response.status === 201){
                  setAccused(accused => [...accused, accused])
                  toast.success("Accused details added successfully",{
                    theme:"colored"
                  })
              }
          }catch(error){
              console.error(error)
          }
      }
  }

  const editAccused = async(litigant_id) => {
      try{
          const response = await api.get(`litigant/${litigant_id}/read/`)
          setSelectedAccused(response.data)
      }catch(error){
          console.log(error)
      }

  }

  const deleteAccused = async(accused) => {
      const newAccused = accused.filter((p) => {
          return p.litigant_id !== accused.litigant_id
      })
      try{
          if(window.confirm("Are you sure want to delete the litigant")){
              const response = await api.delete(`litigant/${accused.litigant_id}/delete/`)
              // if(response.status === 204){
                  setAccused(newAccused)
                  toast.error(t('alerts.petitioner_deleted').replace('{petitioner}', accused.litigant_id), {
                      theme: "colored"
                  }) 
              // }
          }
      }catch(error){
          console.log(error)
      }
  }
   
  return (
      <div className="container-fluid">
          <AccusedList 
              accused={accused} 
              deleteAccused={deleteAccused} 
              editAccused={editAccused}
          />
          <AccusedForm 
              addAccused={addAccused} 
              selectedAccused={selectedAccused}
          />
      </div>
  )
}

export default Accused


