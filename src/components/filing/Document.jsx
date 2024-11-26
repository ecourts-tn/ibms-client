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
import ViewDocument from 'components/common/ViewDocument';

const Document = ({swornRequired}) => {

    const {documents} = useContext(DocumentContext)
    const {language}  = useContext(LanguageContext)
    const initialState = {
        title: '',
        document: ''
    }
    const[form, setForm] = useState(initialState)
    const[documentList, setDocumentList] = useState([])

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
                const efile_no = sessionStorage.getItem("efile_no")
                const response = await api.get("case/document/", {params:{efile_no}})
                if(response.status === 200){
                    setDocumentList(response.data)
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
            const response = await api.delete(`case/document/${document.id}/`)
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
        formData.append("efile_no", sessionStorage.getItem("efile_no"));
        formData.append("title", form.title);
        formData.append("document", form.document);

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
            toast.success(`Document ${response.data.id} uploaded successfully`, {
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
    }
};


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
                                    <th>Document No.</th>
                                    <th>{t('document_title')}</th>
                                    <th>Key</th>
                                    <th>{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentList.map((d, index) => (
                                <tr>
                                    <td>{ index+1}</td>
                                    <td>{ d.id }</td>
                                    <td>{ language === 'ta' ? d.title?.document_lname : d.title?.document_name }</td>
                                    <td>{ d.hash }</td>
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
                                        title={language === 'ta' ? selectedDocument?.document_lname : selectedDocument?.document_name}
                                        show={!!selectedDocument}
                                        handleClose={handleClose}
                                    />
                                )}
                            </tbody>
                        </table>
                    )}
                    <form encType='multipart/form-data'>
                        <div className="row">
                            <div className="col-md-5 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="title">{t('document_title')}</label>
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
                            <div className="col-md-5 mt-4"> 
                                <div className="form-group">
                                <label htmlFor="document">{t('document')}</label>
                                <input 
                                    type="file" 
                                    name="document" 
                                    className="form-control"
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
                                            {t('upload')}
                                        </Button>
                                    </div>
                                </div>
                        </div>
                        { swornRequired && (
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">{t('enrollment_number')}</label>
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
                                >{t('sworn_affidavit')}</Button>
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
                        </div>
                        )}
                    </form>
                </div>    
            </div>  
        </div>
    )
}

export default Document