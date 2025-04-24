import React, {useState, useEffect, useContext} from 'react'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify'
import ViewDocument from 'components/utils/ViewDocument'
import { useNavigate, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { formatDate, ModelClose } from 'utils'
import api from 'api'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Loading from 'components/utils/Loading'
import { BaseContext } from 'contexts/BaseContext'
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'
import { useLocalizedNames } from 'hooks/useLocalizedNames'


const DraftList = () => {

    const navigate = useNavigate()
    const[cases, setCases] = useState([])
    const[errors, setErrors] = useState([])
    const[selectedDocument, setSelectedDocument] = useState(null)
    const[showError, setShowError] = useState(false)
    const handleErrorClose = () => setShowError(false);
    const handleErrorShow = () => setShowError(true);
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const {setEfileNumber, clearEfileNumber} = useContext(BaseContext)
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
    
    const handleShow = (document) => {
        console.log(document)
        setSelectedDocument(document)
    }

    const handleClose = () => {
        setSelectedDocument(null)
    }

    const {
        getCourtName,
        getDistrictName,
        getSeatName
    } = useLocalizedNames()

    useEffect(() => {
        const fetchPetition = async() => {
            try{
                setLoading(true)
                const response = await api.get(`case/filing/pending/`, {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                      },
                })
                setCases(response.data.results)
                setCount(response.data.count);
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition()
    }, [page, pageSize, search])



    const handleEdit = (petition) => {
        if (!window.confirm("Are you sure you want to edit the petition?")) {
            return; // Exit the function if the user cancels
        }
        setEfileNumber(petition.efile_number)
        const route = petition.case_type.url;
        if (route) {
            navigate(route);
        } else {
            console.error("Invalid case type:", petition.case_type);
            alert("Invalid case type. Please contact support.");
        }
    };

    const handleSubmit = async(efile_no) => {
        if(window.confirm("Are you sure you want to submit the petition")){
            try{
                setLoading(true)
                const response = await api.post("case/filing/final-submit/", { efile_no})
                if(response.status === 200){
                    try{
                        const result = await api.put(`case/filing/final-submit/`, {efile_no})
                        if(result.status === 200){
                            toast.success("Petition submitted successfully", {
                                theme:"colored"
                            })
                        }
                        clearEfileNumber()
                        setTimeout(() => {
                            navigate('/filing/dashboard')
                        }, 2000)
                    }catch(error){
                        console.error(error)
                    }
                }
            }catch(error){
                if(error.response?.status === 400){
                    setShowError(true)
                    setErrors(error.response?.data.messages)
                }
            }finally{
                setLoading(false)
            }
        }
    }

    return (
        <React.Fragment>
            <ToastContainer />  {loading && <Loading />}
            <ValidateSubmission 
                showError={showError}
                handleErrorClose={handleErrorClose}
                errors={errors}
            />
            { selectedDocument && (
                <ViewDocument 
                    url={`${config.docUrl}${selectedDocument.document}`}
                    title={ language === 'ta' ? selectedDocument.title?.document_lname || null : selectedDocument.title?.document_name || null}
                    show={!!selectedDocument}
                    handleClose={handleClose}
                />
            )}
            <div className="container-fluid px-md-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#/">{t('home')}</a></li>
                                <li className="breadcrumb-item"><a href="#/">{t('petitions')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('draft_petition')}</li>
                            </ol>
                        </nav>
                        <h3 className='pb-2'><strong>{t('draft_petition')}</strong></h3>
                        <ListFilter 
                            search={search}
                            setSearch={setSearch}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            count={count}
                        />
                        <div>
                            {/* Desktop Table View */}
                            <div className="d-none d-md-block">
                                <table className="table table-striped table-bordered">
                                    <thead className="bg-info">
                                        <tr className="text-center">
                                        <th>{t("sl_no")}</th>
                                        <th>{t("efile_number")}</th>
                                        <th>{t("court")}</th>
                                        <th>{t("litigants")}</th>
                                        <th>{t("documents")}</th>
                                        <th>{t("payment")}</th>
                                        <th>{t("action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {cases.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Link
                                                to="/filing/detail"
                                                state={item.petition?.efile_number ? { efile_no: item.petition.efile_number } : undefined}
                                            >
                                                <strong>{item.petition?.efile_number}</strong>
                                            </Link>
                                            <span style={{ display: "block" }}>
                                                {t("efile_date")}: {formatDate(item.petition?.efile_date)}
                                            </span>
                                        </td>
                                        <td>
                                            { (item.petition.judiciary?.id== 2 || item.petition.judiciary?.id== 3) && (
                                                `${getCourtName(item.petition.court)}, ${getDistrictName(item.petition.district)}`
                                            )}
                                            { item.petition.judiciary.id === 1 && (
                                                `${getSeatName(item.petition.seat)}`
                                            )}
                                        </td>
                                        <td>
                                            {item.petition.pet_name} <span className='text-danger mx-2'>Vs</span>{item.petition.res_name}
                                        </td>
                                        <td>
                                        {item.document.map((d, idx) => (
                                            <a key={idx} onClick={() => handleShow(d)} href="#" className='d-block'>
                                                {language === "ta" ? d.title?.document_lname || null : d.title?.document_name || null}
                                            </a>
                                        ))}
                                        </td>
                                        <td>
                                        {item.fees.map((fee, idx) => (
                                            <span key={idx} className="d-block">Rs.{fee.amount}</span>
                                        ))}
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-start align-items-center">
                                                <Button 
                                                    variant="primary" 
                                                    onClick={() => handleEdit(item.petition)}
                                                    className='btn-sm'
                                                >
                                                    <i></i>{t("edit")}
                                                </Button>
                                                <Button 
                                                    variant="success" 
                                                    className="ml-1 btn-sm" 
                                                    onClick={() => handleSubmit(item.petition.efile_number)}
                                                >
                                                    <i className=""></i>{t("submit")}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table> 
                            </div>
                            <div className="d-md-none">
                                {cases.map((item, index) => (
                                <div key={index} className="card mb-3 border shadow-sm">
                                    <div className="card-header bg-info">
                                        <span className="">
                                            <strong>{item.petition?.efile_number}</strong><br/>
                                            <span className="">{t("efile_date")}: {formatDate(item.petition?.efile_date)}</span>
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p ><strong>{t("court")}</strong><br/>
                                        {item.petition?.judiciary.id === 1
                                        ? language === "ta" ? item.petition.seat?.seat_lname : item.petition.seat?.seat_name
                                        : <>
                                            {language === "ta" ? item.petition.court?.court_lname : item.petition.court?.court_name}<br />
                                            {language === "ta" ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name}<br />
                                            {language === "ta" ? item.petition.district?.district_lname : item.petition.district?.district_name}
                                            </>
                                        }
                                    </p>
                                    <p><strong>{t("litigants")}</strong><br/>
                                        {item.litigants.map((l, idx) => (
                                        <span key={idx} className="d-block">{l.litigant_type === 1 ? "Petitioner: " : "Respondent: "} {l.litigant_name}</span>
                                        ))}
                                    </p>
                                    <p><strong>{t("documents")}</strong><br/></p>
                                    {item.document.map((d, idx) => (
                                        <span key={idx} onClick={() => handleShow(d)} className="badge badge-pill badge-info m-1">
                                        {language === "ta" ? d.title?.document_lname || null : d.title?.document_name || null}
                                        </span>
                                    ))}

                                    <p className="mt-2">{t("payment")}</p>
                                    <p>
                                        {item.fees.map((fee, idx) => (
                                        <span key={idx} className="d-block">Rs.{fee.amount}</span>
                                        ))}
                                    </p>

                                    <div className="d-flex justify-content-between">
                                        <Button variant="outlined" color="primary" onClick={() => handleEdit(item.petition)} className="mr-2">
                                            <i className="fa fa-pencil-alt mr-1"></i>{t("edit")}
                                        </Button>
                                        <Button variant="outlined" color="success" onClick={() => handleSubmit(item.petition.efile_number)}>
                                            <i className="fa fa-upload mr-1"></i>{t("submit")}
                                        </Button>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                        <Pagination
                            page={page}
                            setPage={setPage}
                            count={count}
                            pageSize={pageSize}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default DraftList



const ValidateSubmission = ({showError, handleErrorClose, errors}) => {

    const {t} = useTranslation()

    return(
        <Modal 
                show={showError} 
                onHide={handleErrorClose} 
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header className="bg-danger">
                    <h6><strong>Unable to submit the application</strong></h6>
                    <ModelClose handleClose={handleErrorClose}/>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                    { errors.map((error, index) => (
                        <li key={index} className='text-danger'><strong>{error}</strong></li>
                    ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="danger" 
                        onClick={handleErrorClose}
                        className="btn btn-sm"
                    >
                        {t('close')}
                    </Button>
                </Modal.Footer>
        </Modal>
    )
}
