import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from './ViewDocument'
import api from '../../api'

const PetitionList = () => {

    const[cases, setCases] = useState([])

    const navigate = useNavigate()

    const [showDocument, setShowDocument] = useState(false);
    const [showVakalath, setShowVakalath] = useState(false)
    const handleClose = () => {
        setShowDocument(false);
        setShowVakalath(false)
    }
    const handleShowDocument = () => setShowDocument(true);
    const handleShowVakalath = () => setShowVakalath(true)
    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/submitted/list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

    const handleSubmit = async(cino) => {
        try{
            if(window.confirm("Are you sure you want to submit the petition")){
                const response = await api.put(`api/bail/filing/${cino}/update/`, {is_draft:false})
                if(response.status === 200){
                    toast.success("Petition submitted successfully",{
                        theme:"colored"
                    })
                }
                navigate("/dashboard")
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Petition</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Submitted</li>
                            </ol>
                        </nav>
                        <h3><strong>Completed Petitions</strong></h3>
                        <table className="table table-striped table-bordered">
                            <thead className="bg-secondary">
                                <tr>
                                    <th>S. No</th>
                                    <th>eFiling Number</th>
                                    <th>Filing Date</th>
                                    <th>Case Number</th>
                                    <th>Litigants</th>
                                    <th>View Documents</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                { cases.map((item, index) => (
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td>
                                        <Link to={`/petition/detail`} state={{cino: item.petition.cino}}>
                                            {item.petition.cino}
                                        </Link>
                                    </td>
                                    <td>{ item.petition.date_of_filing }</td>
                                    <td>
                                        { item.petition.filing_type && (
                                        <span>{ item.petition.filing_type.type_name }/{item.petition.filing_number}/{item.petition.filing_year}</span>
                                        )}
                                    </td>
                                    <td>
                                        { item.petitioner.map((p, index) => (
                                            <span className="text ml-2">{index+1}. {p.petitioner_name}</span>
                                        ))}
                                        <span className="text text-danger text-center mx-3"><strong>Vs</strong></span>
                                        { item.respondent.map((res, index) => (
                                            <span className="text">{res.respondent_name} rep by {res.designation}</span>
                                        ))} 
                                    </td>
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
                                                url={`http://127.0.0.1:8000/${item.petition.vakalath}`}
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
                                                url={`http://127.0.0.1:8000/${item.petition.supporting_document}`}
                                                show={showDocument} 
                                                setShow={setShowDocument} 
                                                handleClose={handleClose} 
                                                handleShow={handleShowDocument}/>
                                        )}
                                    </td>
                                    <td>
                                        <Link to="/petition/pdf" state={{cino:item.petition.cino}}>Download</Link>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PetitionList
