import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from './ViewDocument'
import { formatDate, formatLitigant } from '../../utils'
import api from '../../api'
import config from '../../config'

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
                const response = await api.get(`case/filing/submitted-list/`)
                if(response.status === 200){
                    console.log(response.data)
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
                const response = await api.put(`bail/filing/${cino}/update/`, {is_draft:false})
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
                                    <th>E-Filing Date</th>
                                    <th>Case Number</th>
                                    <th>Litigants</th>
                                    <th>View Documents</th>
                                    <th>Court Fee</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                { cases.map((item, index) => (
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td>
                                        <Link to="/petition/detail" state={{efile_no:item.petition.efile_number}}>
                                            { item.petition.efile_number }
                                        </Link>
                                    </td>
                                    <td>{ formatDate(item.petition.efile_date) }</td>
                                    <td>
                                        {item.petition.reg_type ? `${item.petition.reg_type.type_name}/${item.petition.reg_number}/${item.petition.reg_year}` : null}
                                    </td>
                                    <td className="text-center">
                                        { item.litigant.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                            <span className="text ml-2">{index+1}. {l.litigant_name}</span>
                                        ))
                                        }
                                        <br/>
                                        <span className="text text-danger ml-2">Vs</span> <br/>
                                        { item.litigant.filter((l) => l.litigant_type ===2 ).map((l, index) => (
                                            <span className="text ml-2">{index+1}. {l.litigant_name} {l.designation}</span>
                                        ))
                                        }
                                    </td>
                                    <td>
                                        { item.document.map((d, index) => (
                                            <>
                                                <span key={index}><a href={`${config.docUrl}${d.document}`} target='_blank'>{ d.title }</a></span><br/>
                                                {/* <Link
                                                    onClick={handleShowDocument}
                                                >{d.title}</Link>
                                                { showDocument && (
                                                    <ViewDocument 
                                                        url={`${apiUrl}${d.title}`}
                                                        show={showDocument} 
                                                        setShow={setShowDocument} 
                                                        handleClose={handleClose} 
                                                        handleShow={handleShowDocument}/>
                                                )} */}
                                            </>
                                        ))}
                                    </td>
                                    <td>
                                        { item.fees.map((fee, index) => (
                                            <span>Rs.{fee.amount}<br/></span>
                                        ))}
                                    </td>
                                    <td>
                                        <Link to="/petition/pdf" state={{efile_no:item.petition.efile_number}}>Download</Link>
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
