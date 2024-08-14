import React, {useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from '../../api';
import config from '../../config'


const DocumentContainer = ({petition}) => {

    const initialState = {
        title: '',
        document: ''
    }
    const[form, setForm] = useState(initialState)
    const[documents, setDocuments] = useState([])
    // const[documents, setDocuments] = useState({
    //     vakalath: '',
    //     supporting_document: ''
    // })

    const[otp, setOtp] = useState('')

    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)

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

    useEffect(() => {
        const fetchDocuments = async() => {
            try{
                const efile_no = localStorage.getItem("efile_no")
                const response = await api.get("api/case/document/list/", {params:{efile_no}})
                if(response.status === 200){
                    setDocuments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDocuments()
    }, [])


    const deleteDocument = async(document) => {
        try{
            const newDocuments = documents.filter((g) => {
                return g.id !== document.id
            })
            const response = await api.delete("api/case/document/delete/", {params:{id:document.id}})
            if(response.status === 204){
                setDocuments(newDocuments)
                toast.error("Documents deleted successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }


    const handleSubmit = async () => {
        // let form_data = new FormData();
        // form_data.append('vakalath', documents.vakalath, documents.vakalath.name);
        // form_data.append('supporting_document', documents.supporting_document, documents.supporting_document.name);
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = await api.post(`api/case/document/create/`, form, {
                headers: {
                    'content-type': 'multipart/form-data',
                    // 'X-CSRFTOKEN': CSRF_TOKEN
                },
                params:{
                    efile_no
                }
            })
            if(response.status === 201){
                setDocuments(documents => [...documents, response.data])
                setForm(initialState)
                toast.success(`Document ${response.data.id} uploaded successfully`, {
                    theme:"colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <div className="card card-outline card-success">
                <div className="card-body">
                    { documents.length > 0 && (
                        <table className='table table-bordered table-striped table-sm'>
                            <thead className="bg-info">
                                <tr>
                                    <th>S.No</th>
                                    <th>Title</th>
                                    <th>Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((document, index) => (
                                <tr>
                                    <td>{ index+1}</td>
                                    <td>{ document.title }</td>
                                    <td>
                                        <a href={`${config.apiUrl}${document.document}`} target="_blank" className="btn btn-info btn-sm">View</a>
                                        <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteDocument(document)}>Delete</button>
                                    </td>
                                </tr>    
                                ))}

                            </tbody>
                        </table>
                    )}
                    <form encType='multipart/form-data'>
                        <div className="row">
                            <div className="col-md-5 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="title">Document Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    className="form-control"
                                    value={form.title}
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                />
                                </div>
                            </div>
                            <div className="col-md-5 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="document">Document</label>
                                <input 
                                    type="file" 
                                    name="document" 
                                    className="form-control"
                                    // value={petition.supporting_document}
                                    onChange={(e) => setForm({...form,[e.target.name]:e.target.files[0]})}
                                />
                                </div>
                            </div>
                            <div className="col-md-1 mt-5 pt-2">
                                    <div className="">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleSubmit}
                                        >
                                            Upload
                                        </Button>
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
                                
                                {/* { !mobileVerified && (
                                    <div className="col-sm-2">
                                    <Button 
                                        variant="contained"
                                        color="primary" 
                                        onClick={sendMobileOTP}
                                    >
                                        Send OTP</Button>
                                </div>
                                )} */}
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
                            </div>
                        )}
                    </form>
                </div>    
            </div>  
        </div>
    )
}

export default DocumentContainer