import React, { useEffect } from 'react'
import { useState } from 'react'
import GroundsList from './GroundsList'
import GroundsForm from './GroundsForm'
import api from '../../api'
import {toast, ToastContainer} from 'react-toastify'
import { useTranslation } from 'react-i18next'


const GroundsContainer = () => {

    const[grounds, setGrounds] = useState([])

    const[count, setCount] = useState(0)
    const {t} = useTranslation()

    const incrementCount = () => {
        setCount(count+1)
    }

    const decrementCount = () => {
        setCount(count-1)
    }
    
    useEffect(() => {
        const fecthGrounds = async() => {
            try{
                const efile_no = sessionStorage.getItem("efile_no")
                const response = await api.get("case/ground/list/", {params:{efile_no}})
                if(response.status === 200){
                    setGrounds(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fecthGrounds()
    }, [])

    const addGround = async (ground) => {
        try{
            const efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`case/ground/create/`, ground, {params:{efile_no}})
            if(response.status === 201){
                incrementCount()
                setGrounds(grounds => [...grounds, ground])
                toast.success("Grounds added successfully", {theme:"colored"})
            }
        }catch(error){
            console.error(error)
        }
    }

    const deleteGround = async(ground) => {
        console.log(ground)
        try{
            const newGrounds = grounds.filter((g) => {
                return g.id !== ground.id
            })
            const response = await api.delete("case/ground/delete", {params:{id:ground.id}})
            if(response.status === 204){
                setGrounds(newGrounds)
                decrementCount()
                toast.error("Grounds deleted successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className="container-fluid m-0">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-file mr-2"></i><strong>{t('ground')}</strong></h3>
                </div>
                <div className="card-body p-1">
                    <div className="row">
                        <div className="col-md-12">
                            <GroundsList 
                                grounds={grounds} 
                                deleteGround={deleteGround} 
                                count={count}
                                decrementCount={decrementCount}
                            />
                        </div>   
                        <div className="col-md-12"> 
                            <GroundsForm 
                                addGround={addGround} 
                                count={count}
                                incrementCount={incrementCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
     )
}

export default GroundsContainer