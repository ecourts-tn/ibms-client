import React, {useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from '../../api';


const Documents = ({petition}) => {

    const initialState = {
        title: '',
        document: ''
    }
    const[form, setForm] = useState(initialState)

    const[documents, setDocuments] = useState([])

    const[otp, setOtp] = useState('')
    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)

    useEffect(() => {
        const fetchDocuments = async() => {
            try{
                const cino = localStorage.getItem("cino")
                const response = await api.get("api/documents/list/", {
                    params:{
                        cino:cino
                    }
                })
                if(response.status === 200){
                    setDocuments(response.data)
                }
            }catch(error){
                console.error(error)
                throw Error(error)
            }
        }
        fetchDocuments()
    }, [])


    const saveDocument = async() => {
        try{
            const cino = localStorage.getItem("cino")
            const response = await api.put(`api/bail/document/create/`, form, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                params: {
                    cino:cino
                }
            })
            if(response.status === 201){
                toast.success("Documents uploaded successfully", {
                    theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
            throw Error(error)
        }
    }


    const deleteDocument = async(id) => {
        try{
            const newDocument = documents.filter((document) => {
                return document.id !== id
            })
            const response = await api.delete(`api/bail/document/delete/`, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                params: {
                    id:id
                }
            })
            if(response.status === 204){
                toast.success("Documents deleted successfully", {
                    theme:"colored"
                })
                setDocuments(newDocument)
            }
        }catch(error){
            console.error(error)
            throw Error(error)
        }
    }

    const viewDocument = async(id) => {
        try{
            const response = await api.delete("api/bail/document/read/", {
                params: {
                    id:id
                }
            })
            if(response.status === 200){
                setForm(response.data)
            }
        }catch(error){
            console.error(error)
            throw Error(error)
        }
    }

    const sendMobileOTP = () => {
        // if(otp === ''){
        //     toast.error("Please enter valid mobile number",{
        //         theme:"colored"
        //     })
        // }else{
            // setMobileLoading(true)
        if(mobileOtp){
            toast.success("OTP already verified successfully.", {
                theme: "colored"
            })
            return
        }
            toast.success("OTP has been sent your mobile number",{
                theme:"colored"
            })
            setMobileOtp(true)
        // }
    }

    const verifyMobile = (otp) => {
        if(parseInt(otp) === 123456){
            toast.success("Mobile otp verified successfully",{
                theme:"colored"
            })
            setMobileVerified(true)
        }else{
            toast.error("Invalid OTP. Please enter valid OTP",{
                theme:"colored"
            })
            setMobileVerified(false)
            setMobileOtp(true)
        }
    }

    const handleSubmit = async () => {
        try{
            const cino = localStorage.getItem("cino")
            const response = await api.put(`api/bail/filing/${cino}/document/create/`, documents, {
                headers: {
                    'content-type': 'multipart/form-data',
                  }
            })
            if(response.status === 201){
                toast.success("Documents uploaded successfully", {
                    theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
            throw Error(error)
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-bordered table-striped table-sm">
                        <thead>
                            <tr>
                                <th>S. No.</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Document</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { documents.map((document, index) => (
                            <tr>
                                <td>{ index+1 }</td>
                                <td>{ document.title }</td>
                                <td>{ document.description }</td>
                                <td>{ document.document }</td>
                                <td>
                                    <>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={() => viewDocument(document.id)}
                                        >View</Button>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() => deleteDocument(document.id)}
                                        >Delete</Button>
                                    </>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card card-outline card-success">
                <div className="card-body">
                    <form encType='multipart/form-data'>
                        <div className="row">
                            <div className="col-md-12 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="vakkalat">Upload Vakkalat / Memo of Appearance</label>
                                <input 
                                    type="file" 
                                    name="vakalath"
                                    className="form-control"
                                    onChange={(e) => setDocuments({[e.target.name]:e.target.files[0]})}
                                />
                                </div>
                            </div>
                            <div className="col-md-12 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="document">Supporting Documents</label>
                                <input 
                                    type="file" 
                                    name="supporting_document" 
                                    className="form-control"
                                    onChange={(e) => setDocuments({[e.target.name]:e.target.files[0]})}
                                />
                                </div>
                            </div>
                        </div>
                        { parseInt(petition.case_type) !== 1 && (
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Enrolment Number</label>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder='MS'
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder='Reg. No.'
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder='Reg. Year'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2 mt-4 pt-2">
                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        onClick={sendMobileOTP}
                                        endIcon={<SendIcon />}
                                    >Sworn Affidavit</Button>
                                </div>
                                { mobileOtp && !mobileVerified && (
                                <>
                                    <div className="col-md-1 mt-3 pt-2">
                                        <input 
                                            type="password" 
                                            className="form-control mt-2" 
                                            placeholder="OTP" 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2 mt-3 pt-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-success px-5 mt-2"
                                            onClick={() => verifyMobile(otp)}
                                        >Verify</button>
                                    </div>
                                </>
                                )}
                                { mobileVerified && (
                                    <p className="mt-4 pt-3">
                                        <CheckCircleRoundedIcon color="success"/>
                                        <span className="text-success ml-1"><strong>Verified</strong></span>
                                    </p>
                                )}
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={saveDocument}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>    
            </div>  
        </div>
    )
}

export default Documents