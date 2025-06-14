import React, {useState, useEffect, useContext} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import ViewDocument from 'components/utils/ViewDocument'
import { formatDate, formatLitigant } from 'utils'
import api from 'api'
import config from 'config'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { approvedPetition } from 'services/petitionService'
import Loading from 'components/utils/Loading'
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'
import { useLocalizedNames } from 'hooks/useLocalizedNames'

const ApprovedList = () => {

    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    const { 
        getCourtName,
        getDistrictName,
        getSeatName
    } = useLocalizedNames()

    const handleShow = (document) => {
        setSelectedDocument(document)
    }
    const handleClose = () => {
        setSelectedDocument(null)
    }
    
    useEffect(() => {
        const fetchPetition = async() => {
            try{
                setLoading(true)
                const response = await api.get(`case/filing/approved/`, {
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


    return (
        <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
            {loading && <Loading />}
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className="mt-2 mb-1">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                            <li className="breadcrumb-item"><a href="#">{t('petitions')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('approved_petition')}</li>
                        </ol>
                    </nav>
                    <h3 className="pb-2"><strong>{t('approved_petition')}</strong></h3>
                    <ListFilter 
                        search={search}
                        setSearch={setSearch}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        count={count}
                    />
                    <table className="table table-striped table-bordered">
                        <thead className="bg-info">
                            <tr>
                                <th>{t('sl_no')}</th>
                                <th>{t('efile_number')}</th>
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
                                    <React.Fragment>
                                        <Link 
                                            to="/filing/detail" 
                                            state={item.petition?.efile_number ? { efile_no: item.petition.efile_number } : undefined}
                                        >{item.petition?.efile_number ? (
                                            <strong>{item.petition.efile_number}</strong>
                                        ) : null}
                                        </Link> <br/>
                                        {item.petition?.reg_type?.type_name && item.petition?.reg_number && item.petition?.reg_year ? (
                                            <span className="text-success">
                                                <strong>{`${item.petition.reg_type.type_name}/${item.petition.reg_number}/${item.petition.reg_year}`}</strong>
                                            </span>
                                        ) : null}
                                    </React.Fragment>
                                    {item.petition?.efile_date ? (
                                        <span style={{ display: "block" }}>
                                            {t('efile_date')}: {formatDate(item.petition.efile_date)}
                                        </span>
                                    ) : null}
                                </td>
                                <td>
                                    { item.petition.judiciary.id== 2 && (
                                        `${getCourtName(item.petition.court)}, ${getDistrictName(item.petition.district)}`
                                    )}
                                    { item.petition.judiciary.id === 1 && (
                                        `${getSeatName(item.petition.seat)}`
                                    )}
                                </td>
                                <td className="">
                                    { item.petition.pet_name }
                                        <span className="text-danger mx-2">Vs</span> <br/>
                                    { item.petition.res_name }
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
                    <Pagination 
                        page={page}
                        setPage={setPage}
                        count={count}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </div>
    )
}

export default ApprovedList

