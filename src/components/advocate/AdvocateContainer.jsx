import React, {useState, useEffect} from 'react'
import AdvocateForm from './AdvocateForm'
import AdvocateList from './AdvocateList'
import { toast, ToastContainer } from 'react-toastify'
import api from '../../api'

const AdvocateContainer = () => {
    
    const[advocates, setAdvocates] = useState([])

    useEffect(() => {
        async function fetchAdvocates(){
            try{
                const efile_no = localStorage.getItem("efile_no")
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
            const efile_no = localStorage.getItem("efile_no")
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
    
    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((a) => {
            return a.id !== advocate.id
        })
        /* 
            const response = await api.delete(`api/bail/filing/advocate/delete`) 
            if(response.status === 200){
                toast.success("Advocate details deleted successfully", {
                    theme:"colored"
                })
                setAdvocates(newAdvocate)
            }
        
        */
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
                    />
                </div>
        //     </div>
        // </div>
    )
}

export default AdvocateContainer
