import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { CreateMarkup } from 'utils'
import Editor from 'react-simple-wysiwyg'
import Button from '@mui/material/Button'
import * as Yup from 'yup'
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
            ground.efile_no = sessionStorage.getItem("efile_no")
            const response = await api.post(`case/ground/create/`, ground)
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
        try{
            const newGrounds = grounds.filter((g) => {
                return g.id !== ground.id
            })
            const response = await api.delete(`case/ground/delete/`, {params:{id:ground.id}})
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


const GroundsForm = ({addGround, count, incrementCount}) => {

    const editorRef = useRef(null);
    const {t} = useTranslation()
    const validationSchema = Yup.object({
        description: Yup.string().required("The description field may not be blank").max(3000, "Description should not be more than 3000 characters")
    })

    const initialState = {
        description: ''
    }
    const[ground, setGround] = useState(initialState)
    const[errors, setErrors] = useState(false)

    const saveGround = async () => {
        try{
            await  validationSchema.validate(ground, {abortEarly: false})     
            addGround(ground)
            setGround(initialState)
        }catch(error){
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }

    return (
        <>  
            { count < 3 && (
            <>
                <ToastContainer />
                {/* <textarea name="" id="summernote"></textarea> */}
                <div className="form-group">
                    {/* <label htmlFor="" className='text-left'>Grounds</label> */}
                    <Editor 
                        value={ground.description} 
                        onChange={(e) => setGround({...ground, description: e.target.value })} 
                        style={{ minHeight:'300px'}}
                    />
                    <div className="invalid-feedback">
                        { errors.description }
                    </div>
                </div>
                <div className="form-group">
                    <Button 
                        variant="contained"
                        color="success"
                        onClick={saveGround}
                    >
                        <i className="fa fa-plus mr-2"></i>
                    {t('add_ground')}</Button>
                </div>    
            </>
            )}
        </>
    )
}

const GroundsList = ({grounds, deleteGround}) => {

    const {t} = useTranslation()
    return (
        <>
            { grounds.map((ground, index) => (
                <div className="card" key={index}>
                    <div className="card-body" dangerouslySetInnerHTML={CreateMarkup(ground.description)}>

                    </div>
                    <div className="card-footer d-flex justify-content-end" style={{backgroundColor:"inherit", borderTop:"none", marginTop:"-20px"}}>
                        <Button 
                            variant="contained"
                            color="primary" 
                            size="sm" 
                            className="mr-2"
                        >
                            <i className="fa fa-pencil-alt mr-2"></i>
                        {t('edit')}</Button>
                        <Button 
                            variant="contained"
                            color="error" 
                            size="sm" 
                            onClick={()=>deleteGround(ground) }
                        >
                            <i className="fa fa-trash mr-2"></i>
                        {t('delete')}</Button>
                    </div>
                </div>
            ))}
        </>
    )
}


