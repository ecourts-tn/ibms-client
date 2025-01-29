import React, {useState, useEffect, useContext} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from 'components/common/ViewDocument'
import { formatDate, formatLitigant } from 'utils'
import api from 'api'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { approvedPetition } from 'services/petitionService'
import Loading from 'components/common/Loading'

const ApprovedList = () => {

    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[selectedDocument, setSelectedDocument] = useState(null)
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
                const response = await approvedPetition()
                setCases(response)
                setTotalItems(response.length) 
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition()
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
                        <h3 className="pb-2"><strong>{t('approved_petition')}</strong></h3>
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
                            <thead className="bg-info">
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
                                { currentPetitions.map((item, index) => (
                                <tr>
                                    <td>{ index+1+indexOfFirstItem }</td>
                                    {/* <td>
                                        <Link to="/filing/detail" state={{efile_no:item.petition.efile_number}}>
                                            <strong>{ item.petition.efile_number }</strong>
                                        </Link>
                                        <span style={{display:'block'}}>{t('efile_date')}: { formatDate(item.petition.efile_date) }</span>
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

export default ApprovedList

