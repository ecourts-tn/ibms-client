import React, {useState, useEffect, useContext} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from 'components/common/ViewDocument'
import { formatDate, formatLitigant } from 'utils'
import api from 'api'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { returnedPetition } from 'services/petitionService'
import Loading from 'components/Loading'

const ReturnedList = () => {

    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[selectedDocument, setSelectedDocument] = useState(null)
    const handleShow = (document) => {
        setSelectedDocument(document)
    }
    const handleClose = () => {
        setSelectedDocument(null)
    }

    useEffect(() => {
        const fetchPetition = async() => {
            try{
                const response = await returnedPetition()
                setCases(response)
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition()
    }, [])

    const handleSubmit = async(efile_no) => {
        try{
            if(window.confirm("Are you sure you want to submit the petition")){
                const response = await api.put(`case/filing/update/`, {is_draft:false, efile_number:efile_no})
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
            {loading && <Loading />}
            <ToastContainer />
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                <li className="breadcrumb-item"><a href="#">{t('petitions')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('submitted_petition')}</li>
                            </ol>
                        </nav>
                        <h3 className="pb-2"><strong>{t('returned_petition')}</strong></h3>
                        <table className="table table-striped table-bordered">
                            <thead className="bg-secondary">
                                <tr>
                                    <th>{t('sl_no')}</th>
                                    <th>{t('efile_number')}</th>
                                    <th>{t('case_number')}</th>
                                    <th>{t('court')}</th>
                                    <th>{t('litigants')}</th>
                                    <th>{t('documents')}</th>
                                    <th>{t('payment')}</th>
                                    <th>{t('download')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                { cases.map((item, index) => (
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td>
                                        <Link to="/filing/detail" state={{efile_no:item.petition.efile_number}}>
                                            <strong>{ item.petition.efile_number }</strong>
                                        </Link>
                                        <span style={{display:'block'}}>{t('efile_date')}: { formatDate(item.petition.efile_date) }</span>
                                    </td>
                                    <td>
                                        {item.petition.filing_type ? `${item.petition.filing_type?.type_name}/${item.petition.filing_number}/${item.petition.filing_year}` : null}
                                    </td>
                                    <td>
                                        { item.petition.judiciary.id== 2 && (
                                        <>
                                            <span>{ language === 'ta' ? item.petition.court?.court_lname : item.petition.court?.court_name }</span><br />
                                            <span>{ language === 'ta' ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name }</span><br/>
                                            <span>{ language === 'ta' ? item.petition.district?.district_lname : item.petition.district?.district_name }</span>
                                        </>
                                        )}
                                        { item.petition.judiciary.id === 1 && (
                                        <>
                                            { language === 'ta' ? item.petition.seat?.seat_lname : item.petition.seat?.seat_name}
                                        </>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        { item.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                            <span className="text ml-2" key={index}>{index+1}. {l.litigant_name}</span>
                                        ))
                                        }
                                        <br/>
                                        <span className="text text-danger ml-2">Vs</span> <br/>
                                        { item.litigants.filter((l) => l.litigant_type ===2 ).map((l, index) => (
                                            <span className="text ml-2" key={index}>
                                                {index+1}. {l.litigant_name} { language === 'ta' ? l.designation?.designation_lname : l.designation?.designation_name }</span>
                                        ))
                                        }
                                    </td>
                                    <td>
                                        { item.document.map((d, index) => (
                                            <div>
                                                <span key={index} onClick={()=>handleShow(d)} className='badge badge-pill badge-info mt-1'>
                                                    { language === 'ta' ?  d.title?.document_lname || null : d.title?.document_name || null}
                                                </span>
                                            </div>
                                        ))}
                                        { selectedDocument && (
                                            <ViewDocument 
                                                url={`${config.docUrl}${selectedDocument.document}`}
                                                title={ language === 'ta' ? selectedDocument.title?.document_lname || null : selectedDocument.title?.document_name || null}
                                                show={!!selectedDocument}
                                                handleClose={handleClose}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        { item.fees.map((fee, index) => (
                                            <span>Rs.{fee.amount}<br/></span>
                                        ))}
                                    </td>
                                    <td>
                                        <Link to="/filing/generate/pdf" state={{efile_no:item.petition.efile_number}}>{t('download')}</Link>
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

export default ReturnedList
