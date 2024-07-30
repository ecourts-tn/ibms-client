import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import ViewDocument from './ViewDocument'
import { useNavigate, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { formatDate, formatLitigant } from '../../utils'
import api from '../../api'

const DraftList = () => {

    const[cases, setCases] = useState([])

    const navigate = useNavigate()

    const [showDocument, setShowDocument] = useState(false);
    const [showVakalath, setShowVakalath] = useState(false)
    const[errors, setErrors] = useState([])
    const handleClose = () => {
        setShowDocument(false);
        setShowVakalath(false)
    }
    const handleShowDocument = () => setShowDocument(true);
    const handleShowVakalath = () => setShowVakalath(true)

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/draft/list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

    const [show, setShow] = useState(false);

    const[showError, setShowError] = useState(false)
    const handleErrorClose = () => setShowError(false);
    const handleErrorShow = () => setShowError(true);

    const handleSubmit = async(cino) => {
        if(window.confirm("Are you sure you want to submit the petition")){
            try{
                const response = await api.get("api/bail/filing/final-submit/", {
                    params: {
                        cino: cino
                    }
                })
                if(response.status === 200){
                    if(response.data.error){
                        setShowError(true)
                        setErrors(response.data.message)
                        // response.data.message.forEach((error) => {
                        //     toast.error(error, {
                        //         theme:"colored"
                        //     })
                        // })
                    }else{
                        try{
                            const result = await api.put(`api/bail/filing/${cino}/final-submit/`)
                            if(result.status === 200){
                                toast.success("Petition submitted successfully", {
                                    theme:"colored"
                                })
                            }
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
            <Modal 
                    show={showError} 
                    onHide={handleErrorClose} 
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title><strong>Unable to submit the application</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                        { errors.map((error, index) => (
                            <li key={index} className='text-danger'><strong>{error}</strong></li>
                        ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={handleErrorClose}>
                            Close
                        </Button>
                    </Modal.Footer>
            </Modal>
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#/">Home</a></li>
                                <li className="breadcrumb-item"><a href="#/">Petition</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Draft</li>
                            </ol>
                        </nav>
                        <h3><strong>Draft Petitions</strong></h3>
                        <table className="table table-striped table-bordered">
                            <thead className="bg-secondary">
                                <tr>
                                    <th>S. No</th>
                                    <th>eFiling Number</th>
                                    <th>eFile Date</th>
                                    <th>Litigants</th>
                                    <th>View Documents</th>
                                    <th>Payment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { cases.map((item, index) => (
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td><a href="#/">{ item.petition.efile_number }</a></td>
                                    <td>{ formatDate(item.petition.efile_date) }</td>
                                    <td>{ formatLitigant(item.petitioner, item.respondent)}</td>
                                    <td>
                                    { item.petition.vakalath && (
                                            <>
                                                <Link
                                                    onClick={handleShowVakalath}
                                                >Vakalath</Link>
                                            </>
                                        )}
                                        { showVakalath && (
                                            <ViewDocument 
                                                url={`http://127.0.0.1:8000${item.petition.vakalath}`}
                                                show={showVakalath} 
                                                setShow={setShowVakalath} 
                                                handleClose={handleClose} 
                                                handleShow={handleShowVakalath}/>
                                        )}
                                        { item.petition.supporting_document && (
                                            <>
                                                <Link
                                                    onClick={handleShowDocument}
                                                >Supporting Document</Link>
                                            </>
                                        )}
                                        { showDocument && (
                                            <ViewDocument 
                                                url={`http://127.0.0.1:8000${item.petition.supporting_document}`}
                                                show={showDocument} 
                                                setShow={setShowDocument} 
                                                handleClose={handleClose} 
                                                handleShow={handleShowDocument}/>
                                        )}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <button className="btn btn-info mx-1">
                                            <i className="fa fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn btn-danger mx-1">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick = {(e) => handleSubmit(item.petition.cino) }
                                        >
                                            Submit
                                        </Button>
                                    </td>
                                </tr>
                                ))}
                                { cases.length <= 0 && (
                                <tr>
                                    <td colSpan={6} className="text-danger text-center">***** No petitions found *****</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DraftList
