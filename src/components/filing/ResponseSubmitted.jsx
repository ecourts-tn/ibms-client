import React, { useContext, useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { formatDate } from 'utils'
import Loading from 'components/utils/Loading'
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'


const ResponsePending = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false)
    const [petitions, setPetitions] = useState([])
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchPetitions() {
            setLoading(true)
            try{
                const response = await api.get("prosecution/response/submitted/",{
                  params: {
                      page,
                      page_size: pageSize,
                      search,
                    },
              });
                setPetitions(response.data.results)
                setCount(response.data.count)
            }
            catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetitions();
    }, [page, pageSize, search]); 

    return (
        <div className="container-fluid mt-3">
            { loading && <Loading />}
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className="mt-2 mb-1">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#/">{t('home')}</a></li>
                            <li className="breadcrumb-item"><a href="#/">{t('petitions')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('submitted_response')}</li>
                        </ol>
                    </nav>
                    <h3 className='pb-2'><strong>{t('submitted_response')}</strong></h3>
                    <ListFilter 
                        search={search}
                        setSearch={setSearch}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        count={count}
                    />
                    <table className="table table-bordered table-striped">
                        <thead className="bg-info">
                            <tr>
                                <th>{t('sl_no')}</th>
                                <th>{t('efile_number')}</th>
                                <th>{t('court')}</th>
                                <th>Crime Number/Year</th>
                                <th>Accused Details</th>
                            </tr>
                        </thead>
                        <tbody>
                        { petitions.map((item, index) => (
                            <tr key={index}>
                                <td>{ index + 1 }</td>
                                <td>
                                    <Link to="/pp-remarks/" state={{efile_no:item.petition.efile_number}}>
                                        <strong>{ item.petition.efile_number }</strong>
                                    </Link>
                                    <span style={{display:"block"}}>{t('efile_date')}: {formatDate(item.petition.efile_date)}</span>
                                </td>
                                <td>
                                    <span>{ language === 'ta' ? item.petition.court?.court_lname : item.petition.court?.court_name }</span><br />
                                    <span>{ language === 'ta' ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name }</span><br/>
                                    <span>{ language === 'ta' ? item.petition.district?.district_lname : item.petition.district?.district_name }</span>
                                </td>
                                <td>{ item.fir_number }/{ item.fir_year }</td>
                                <td>
                                    { item.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                        <span className="text ml-2" style={{display:'block'}} key={index}>{index+1}. {l.litigant_name}</span>
                                    ))}
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

export default ResponsePending