import api from 'api';
import config from 'config'
import React, {useState, useEffect, useContext} from 'react'
import SendIcon from '@mui/icons-material/Send';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Button from '@mui/material/Button'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next';
import { DocumentContext } from 'contexts/DocumentContext';
import { LanguageContext } from 'contexts/LanguageContex';
import ViewDocument from 'components/utils/ViewDocument';
import Loading from 'components/utils/Loading';
import { formatDate } from 'utils';
import { MasterContext } from 'contexts/MasterContext';
import { BaseContext } from 'contexts/BaseContext';

const Document = ({swornRequired}) => {
    swornRequired = true
    const { masters: {documents}} = useContext(MasterContext)
    const {language}  = useContext(LanguageContext)
    const initialState = {
        title: '',
        document: ''
    }
    const {efileNumber} = useContext(BaseContext)
    const[form, setForm] = useState(initialState)
    const[documentList, setDocumentList] = useState([])
    const[loading, setLoading] = useState(false)
    const[otp, setOtp] = useState('')
    const {t} = useTranslation()
    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState(null);

    
    const handleShow = (document) => {
        setSelectedDocument(document);
    };

    // Close the modal by clearing the selected document
    const handleClose = () => {
        setSelectedDocument(null);
    };

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
                const response = await api.get("case/document/", {params:{efile_no:efileNumber}})
                if(response.status === 200){
                    setDocumentList(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efileNumber){
            fetchDocuments()
        }
    }, [])


    const deleteDocument = async(document) => {
        try{
            const response = await api.delete(`case/document/delete/`, {
                data:{
                    id:document.id,
                    efile_no:document.efile_no
                }
            })
            if(response.status === 204){
                setDocumentList((prevList) => prevList.filter((d) => d.id !== document.id));
                toast.error("Documents deleted successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }


    const handleSubmit = async () => {
    try {
        // Add efile_no to the form data
        const formData = new FormData();
        formData.append("efile_no", efileNumber);
        formData.append("title", form.title);
        formData.append("document", form.document);
        setLoading(true)
        const response = await api.post(`case/document/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 201) {
            // Update the document list with the new document
            setDocumentList((documents) => [...documents, response.data]);
            // setForm(initialState); // Reset the form state
            setForm({
                title: "",
                document: null,
            });
            toast.success(`Document ${response.data.efile_no}${response.data.document_id} uploaded successfully`, {
                theme: "colored",
            });
        }
    } catch (error) {
        console.error("Error uploading document:", error);

        // Handle specific error scenarios
        if (error.response?.status === 400) {
            toast.error("Invalid form data. Please check your input.", {
                theme: "colored",
            });
        } else {
            toast.error("An error occurred while uploading. Please try again.", {
                theme: "colored",
            });
        }
    }finally{
        setLoading(false)
    }
};


    return (
        <div className="container-fluid">
            { loading && <Loading />}
            <div className="row">
                <div className="col-md-12">
                    <ToastContainer />
                    { Object.keys(documentList).length > 0 && (
                        <table className='table table-bordered table-striped table-sm'>
                            <thead>
                                <tr className="bg-info">
                                    <th>S.No</th>
                                    <th>Document No.</th>
                                    <th>{t('document_title')}</th>
                                    <th>{t('upload_date')}</th>
                                    <th>{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentList.map((d, index) => (
                                <tr>
                                    <td>{ index+1}</td>
                                    <td>{`${d.efile_no}${d.document_id}`}</td>
                                    <td>{ language === 'ta' ? d.title?.document_lname : d.title?.document_name }</td>
                                    <td>{ formatDate(d.created_at) }</td>
                                    <td>
                                        <button onClick={() => handleShow(d)} className="btn btn-info btn-sm">{t('view')}</button>
                                        <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteDocument(d)}>{t('delete')}</button>
                                    </td>
                                </tr>    
                                ))}

                                {/* ViewDocument Modal, only shown if selectedDocument is not null */}
                                {selectedDocument && (
                                    <ViewDocument
                                        url={`${config.docUrl}${selectedDocument.document}`}
                                        title={ language === 'ta' ? selectedDocument.title?.document_lname || null : selectedDocument.title?.document_name || null}
                                        show={!!selectedDocument}
                                        handleClose={handleClose}
                                    />
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <form encType='multipart/form-data'>
                <div className="form-group row my-4">
                    <label htmlFor="title" className='col-sm-3 col-form-label'>{t('document_title')}</label>
                    <div className="col-md-5"> 
                        <select 
                            name="title" 
                            className="form-control"
                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                        >
                            <option value="">{t('alerts.select_document')}</option>
                            { documents.map((d, index) => (
                            <option key={index} value={d.id}>{ language === 'ta' ? d.document_lname : d.document_name }</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label htmlFor="document" className="col-sm-3 col-form-label">{t('document')}</label>
                    <div className="col-md-5"> 
                        <input 
                            type="file" 
                            name="document" 
                            className="form-control"
                            onChange={(e) => setForm({...form,[e.target.name]:e.target.files[0]})}
                        />
                    </div>
                </div>
                { swornRequired && (
                <div className="form-group row mb-4 no-gutters">
                    <label htmlFor="" className="col-sm-3 col-form-label">{t('enrollment_number')}</label>
                    <div className="col-md-1 ml-2">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder='MS'
                        />
                    </div>
                    <div className="col-md-1">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder='Reg. No.'
                        />
                    </div>
                    <div className="col-md-1">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder='Reg. Year'
                        />
                    </div>
                    <div className="col-md-2 ml-2">
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={sendMobileOTP}
                            endIcon={<SendIcon />}
                        >{t('sworn_affidavit')}</Button>
                    </div>
                </div>   
                )}
                { mobileOtp && (
                <div className='form-group row mb-4'>
                    <label htmlFor="" className='col-sm-3 col-form-group'>Verify OTP</label>
                    <div className="col-md-1">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="OTP" 
                            value={otp}
                            disabled={mobileVerified}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div className="col-md-1">
                        <button 
                            type="button" 
                            className="btn btn-success px-4"
                            onClick={() => verifyMobile(otp)}
                            disabled={mobileVerified}
                        >Verify</button>
                    </div>
                    { mobileVerified && (
                        <div className="col-md-2">
                            <CheckCircleRoundedIcon color="success"/>
                            <span className="text-success ml-1"><strong>Verified</strong></span>
                        </div>
                    )}
                </div>
                )}
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                        >
                            {t('upload')}
                        </Button>
                    </div>
                </div>
            </form>
        </div>    
    )
}

export default Document