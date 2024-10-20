import React from 'react'
import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import EFileDetails from './EFileDetails'
import {toast, ToastContainer} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { useTranslation } from 'react-i18next'

const EFile = () => {
    const navigate = useNavigate()
    const[isFinalSubmit, setIsFinalSubmit] = useState(false)
    const[show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[allChecked, setAllChecked] =  useState(false)
    const[isConfirm, setIsConfirm] = useState(false)
    const {t} = useTranslation()

    const handleSubmit = async () => {
        const efile_no = sessionStorage.getItem("efile_no")
        if(efile_no){
            try{
                const response = await api.get("case/filing/final-submit/", {
                    params: {
                        efile_no
                    }
                })
                if(response.status === 200){
                    if(response.data.error){
                        response.data.message.forEach((error) => {
                            toast.error(error, {
                                theme:"colored"
                            })
                        })
                        setIsFinalSubmit(false)
                    }else{
                        try{
                            const result = await api.put(`case/filing/${efile_no}/final-submit/`)
                            if(result.status === 200){
                                toast.success("Petition filed successfully", {
                                    theme:"colored"
                                })
                            }
                            sessionStorage.removeItem("efile_no")
                            navigate('/dashboard')
                        }catch(error){
                            console.error(error)
                        }
                    }
                }
            }catch(error){
                console.log(error)
            }
        }       
    }

    return (
        <>
            <ToastContainer />
            <div className="row mt-5">
                <div className="col-md-6 offset-3">
                    <div className="mt-3">
                        <input type="checkbox" name="declaration" id="declaration" onChange={()=>setAllChecked(true)}/> {t('condition_1')} 
                    </div>
                    <div className="mt-3">
                        <input type="checkbox" name="declaration" id="declaration" onChange={()=>setAllChecked(true)}/> {t('condition_2')}
                    </div>
                </div>
                <div className="col-md-6 offset-3 text-center mt-5">
                    <Button

                        variant="contained"
                        color="warning"
                        onClick={ isFinalSubmit ? handleSubmit : handleShow}
                        disabled={ !allChecked }
                    >   
                        <i className="fa fa-paper-plane mr-2"></i>
                        { isFinalSubmit ? t('final_submit') : t('view_draft')}
                    </Button>
                    <Button

                        variant="contained"
                        color="success"
                        className='ml-2'
                        onClick={ isFinalSubmit ? handleSubmit : handleShow}
                        disabled={ !allChecked }
                    >   
                        <i className="fa fa-paper-plane mr-2"></i>
                        {t('submit')}
                    </Button>
                </div>
            </div>
            <Modal 
                    show={show} 
                    onHide={handleClose} 
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title><strong>{t('draft_application')}</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EFileDetails />
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: "space-between", alignItems:"center"}}>
                        <div>
                            <input 
                                type="checkbox" 
                                checked={isConfirm}
                                onChange={(e) => setIsConfirm(!isConfirm)}
                            /> <span style={{ color:"#D93900", paddingLeft:"2px"}}>
                                <strong>{t('confirmation')}</strong>
                            </span>
                        </div>
                        <div>
                            { isConfirm && (
                                <Button 
                                    variant="contained"
                                    color="success"
                                    onClick = {(e) => {
                                            // if(window.confirm("Are you sure?")){
                                                setIsFinalSubmit(!isFinalSubmit);
                                                handleClose()
                                            // }
                                        }
                                    }
                                >
                                    {t('submit')}
                                </Button>
                            )}
                        </div>
                        <div>
                            <Button variant="contained" onClick={handleClose}>
                                {t('close')}
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
            
        </>
    )
}

export default EFile