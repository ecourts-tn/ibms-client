import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { formatDate } from 'utils'
import Loading from 'components/Loading'
import api from 'api'

const ConditionList = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { language } = useContext(LanguageContext)
    const [petitions, setPetitions] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) // Default items per page
    const [totalItems, setTotalItems] = useState(0)

    useEffect(() => {
        async function fetchPetitions() {
            try {
                setLoading(true)
                const response = await api.get("police/response/pending/")
                if (response.status === 200) {
                    setPetitions(response.data)
                    setTotalItems(response.data.length) // Update total items
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchPetitions()
    }, [])

    // Filter petitions based on search term (efile_number or crime_number/year)
    const filteredPetitions = petitions.filter(item => {
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
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Condition List</strong></h3>
                        </div>
                        <div className="card-body">
                            {/* Search and Items per page filter */}
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

                            <div className="row">
                                <table className="table table-bordered table-striped">
                                    <thead className="bg-secondary">
                                        <tr>
                                            <th>{t('sl_no')}</th>
                                            <th>{t('Case Number or efile_number')}</th>
                                            <th>{t('court')}</th>
                                            <th>Crime Number/Year</th>
                                            <th>Date & Place of Occurence</th>
                                            <th>Accused Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {currentPetitions.map((item, index) => (
                                        <tr key={index}>
                                            <td>{ index + 1 + indexOfFirstItem }</td>
                                            {/* <td>
                                                <Link to="/police/condition/create/" state={{efile_no:item.petition.efile_number}}>
                                                    <strong>{ `${item.petition.reg_type?.type_name}/${item.petition.reg_number}/${item.petition.reg_year}` }</strong><br />
                                                    <strong>{ item.petition.efile_number }</strong>
                                                </Link>
                                                <span style={{display:"block"}}>{t('efile_date')}: {formatDate(item.petition.efile_date)}</span>
                                            </td> */}

                                            <td>
                                                <Link 
                                                    to="/police/condition/create/" 
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
                                            <td>{ item.crime?.fir_number }/{ item.crime?.fir_year }</td>
                                            <td>
                                                { item.crime?.date_of_occurrence}<br/>
                                                { item.crime?.place_of_occurrence}
                                            </td>
                                            <td className="text-center">
                                                { item.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                                    <span className="text ml-2" style={{display:'block'}} key={index}>{index+1}. {l.litigant_name}</span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

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
            </div>          
        </>
    )
}

export default ConditionList
