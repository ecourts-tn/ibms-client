import React, {useState, useEffect, useContext} from 'react'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import ViewDocument from 'components/common/ViewDocument'
import { useNavigate, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { formatDate } from 'utils'
import api from 'api'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Loading from 'components/Loading'
import { pendingPetition } from 'services/petitionService'


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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) // Default items per page
    const [totalItems, setTotalItems] = useState(0)
    
    const handleShow = (document) => {
        setSelectedDocument(document)
    }

    const handleClose = () => {
        setSelectedDocument(null)
    }
    
    useEffect(() => {
        const fetchPetition = async() => {
            try{
                const response = await pendingPetition()
                // if (response.status === 200) {
                    setCases(response)
                    setTotalItems(response.length) 
                // }
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition();
    }, [])

    // Filter petitions based on search term (efile_number or crime_number/year)
    const filteredPetitions = cases.filter(item => {
        const efileMatch = item.petition.efile_number.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Concatenate crime number and year into a single string for search
        const crimeNumberYear = `${item.crime?.fir_number}/${item.crime?.fir_year}`;
        const crimeMatch = crimeNumberYear.toLowerCase().includes(searchTerm.toLowerCase());

        const caseNumber = `${item.petition.reg_type?.type_name}/${item.petition.reg_number}/${item.petition.reg_year}` ;
        const caseMatch = caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

        return efileMatch || crimeMatch || caseMatch;
    })

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentPetitions = filteredPetitions.slice(indexOfFirstItem, indexOfLastItem)

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value)) // Update items per page
        setCurrentPage(1) // Reset to the first page whenever the items per page change
    }

    // Calculate total number of pages
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(filteredPetitions.length / itemsPerPage); i++) {
        pageNumbers.push(i)
    }

    const handleEdit = (efile_no) => {
        if (window.confirm("Are you sure you want to edit the petition?")) {
            sessionStorage.setItem('efile_no', efile_no);
            navigate("/filing/bail/initial-input");
        }
    };

    const handleSubmit = async(efile_no) => {
        if(window.confirm("Are you sure you want to submit the petition")){
            try{
                const response = await api.post("case/filing/final-submit/", { efile_no})
                if(response.status === 200){
                    try{
                        const result = await api.put(`case/filing/final-submit/`, {efile_no})
                        if(result.status === 200){
                            toast.success("Petition submitted successfully", {
                                theme:"colored"
                            })
                        }
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
                            {t('close')}
                        </Button>
                    </Modal.Footer>
            </Modal>
            {loading && <Loading />}
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
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
                        <div className="row mb-3">
                            <label className="mr-2">{t('Search')}:</label>
                            <div className="col-md-3">
                                {/* Search Box */}
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('Search Case or Efile or Crime number')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Handle search input change
                                    />
                                </div>
                            </div>

                            <div className="col-md-1">
                                <div className="d-flex align-items-center">
                                    <label className="mr-2">{t('Filter')}:</label>
                                    <select 
                                        className="form-control" 
                                        value={itemsPerPage} 
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered">
                            <thead className="bg-secondary">
                                <tr className='text-center'>
                                    <th>{t('sl_no')}</th>
                                    <th>{t('efile_number')}</th>
                                    <th>{t('court')}</th>
                                    <th>{t('litigants')}</th>
                                    <th>{t('documents')}</th>
                                    <th>{t('payment')}</th>
                                    <th>{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                { currentPetitions.map((item, index) => (
                                <tr key={index}>
                                    <td>{ index + 1 + indexOfFirstItem }</td>
                                    {/* <td>
                                        <Link to="/filing/detail" state={{efile_no:item.petition.efile_number}}>
                                            <strong>{ item.petition.efile_number }</strong>
                                        </Link>
                                        <span style={{display:"block"}}>{t('efile_date')}: {formatDate(item.petition.efile_date)}</span>
                                    </td> */}
                                    <td>
                                        <Link 
                                            to="/filing/detail" 
                                            state={item.petition?.efile_number ? { efile_no: item.petition.efile_number } : undefined}
                                        >
                                            {item.petition?.reg_type?.type_name && item.petition?.reg_number && item.petition?.reg_year ? (
                                                <strong>{`${item.petition.reg_type.type_name}/${item.petition.reg_number}/${item.petition.reg_year}`}</strong>
                                            ) : null}
                                            <br />
                                            {item.petition?.efile_number ? (
                                                <strong>{item.petition.efile_number}</strong>
                                            ) : null}
                                        </Link>
                                        {item.petition?.efile_date ? (
                                            <span style={{ display: "block" }}>
                                                {t('efile_date')}: {formatDate(item.petition.efile_date)}
                                            </span>
                                        ) : null}
                                    </td>
                                    <td>
                                        <span>{ language === 'ta' ? item.petition.court?.court_lname : item.petition.court?.court_name }</span><br />
                                        <span>{ language === 'ta' ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name }</span><br/>
                                        <span>{ language === 'ta' ? item.petition.district?.district_lname : item.petition.district?.district_name }</span>
                                    </td>
                                    <td className="text-center">
                                        { item.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                            <span className="text ml-2" key={index}>{index+1}. {l.litigant_name}</span>
                                        ))}
                                            <br/>
                                            <span className="text text-danger ml-2">Vs</span> <br/>
                                        { item.litigants.filter((l) => l.litigant_type ===2 ).map((l, index) => (
                                            <span className="text ml-2" key={index}>{index+1}. {l.litigant_name} {l.designation?.designation_name}</span>
                                        ))}
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
                                            <span key={index}>Rs.{fee.amount}<br/></span>
                                        ))}
                                    </td>
                                    <td>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(item.petition.efile_number)}
                                        >
                                            <i className="fa fa-pencil-alt mr-1"></i>{t('edit')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            className="ml-1"
                                            onClick = {(e) => handleSubmit(item.petition.efile_number) }
                                        >
                                            <i className="fa fa-upload mr-1"></i>{t('submit')}
                                        </Button>
                                    </td>
                                </tr>
                                ))}
                                {/* { currentPetitions.length <= 0 && (
                                <tr>
                                    <td colSpan={6} className="text-danger text-center">***** No petitions found *****</td>
                                </tr>
                                )} */}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="d-flex justify-content-between mt-3">
                            <div className="pagination">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>{t('previous')}</button>
                                    </li>
                                    {pageNumbers.map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>{t('next')}</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="page-info">
                                <span>{t('showing')} {indexOfFirstItem + 1} {t('to')} {indexOfLastItem} {t('of')} {filteredPetitions.length} {t('entries')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DraftList
