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
                const cino = localStorage.getItem("cino")
                const response = await api.get(`api/bail/filing/${cino}/advocate/list/`)
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
            const cino = localStorage.getItem("cino")
            const response = await api.post(`api/bail/filing/${cino}/advocate/create/`, advocate)
            if(response.status === 201){
                toast.success("Advocate details added successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }
    
    const deleteAdvocate = () => {

    }

    console.log(advocates)

    
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
