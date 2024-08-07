import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import api from '../../api'
import Editor from 'react-simple-wysiwyg';
// import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import './style.css'


const GroundsForm = ({addGround, count, incrementCount}) => {

    const editorRef = useRef(null);
    const validationSchema = Yup.object({
        description: Yup.string().required("The description field may not be blank").max(3000, "Description should not be more than 3000 characters")
    })

    const initialState = {
        id: nanoid(),
        description: ''
    }
    const onChange = () => {

    }

    const[ground, setGround] = useState(initialState)
    const[errors, setErrors] = useState(false)

    const saveGround = async () => {
        try{
            await  validationSchema.validate(ground, {abortEarly: false})
            const cino = localStorage.getItem("cino")
            const response = await api.post(`api/bail/filing/${cino}/grounds/create/`, ground)
            incrementCount()
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
                    Add Ground</Button>
                </div>    
            </>
            )}
        </>
    )
}

export default GroundsForm