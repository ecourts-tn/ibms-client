import React, {useState, useEffect, useContext} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from './ViewDocument'
import { formatDate, formatLitigant } from '../../utils'
import api from '../../api'
import config from '../../config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const PetitionList = () => {

    const[cases, setCases] = useState([])

    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
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
                                    <th>Filing Number</th>
                                    <th>Court Details</th>
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
                                            <strong>{ item.petition.efile_number }</strong>
                                        </Link>
                                        <span style={{display:'block'}}>Date: { formatDate(item.petition.efile_date) }</span>
                                    </td>
                                    <td>
                                        {item.petition.filing_type ? `${item.petition.filing_type?.type_name}/${item.petition.filing_number}/${item.petition.filing_year}` : null}
                                    </td>
                                    <td>
                                        { item.petition.judiciary.id== 2 && (
                                        <>
                                            { language === 'ta' ? item.petition.court.court_lname : item.petition.court.court_name }, 
                                            { language === 'ta' ? item.petition.establishment.establishment_lname : item.petition.establishment.establishment_name }, 
                                            { language === 'ta' ? item.petition.district.district_lname : item.petition.district.district_name }
                                        </>
                                        )}
                                        { item.petition.judiciary.id === 1 && (
                                        <>
                                            { language === 'ta' ? item.petition.seat?.seat_lname : item.petition.seat?.seat_name}
                                        </>
                                        )}
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
