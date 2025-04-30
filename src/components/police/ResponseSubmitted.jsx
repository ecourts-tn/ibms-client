import React, { useContext } from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import api from '../../api'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Loading from 'components/utils/Loading'
import { formatDate } from 'utils'
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'



const ResponseSubmitted = () => {

    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[loading, setLoading] = useState(false)
    const[petitions, setPetitions] = useState([])
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchPetitions() {
            try{
                setLoading(true)
                const response = await api.get("police/response/list/", {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                        status:true
                    },
                });
                if (response.status === 200) {
                    setPetitions(response.data.results)
                    setCount(response.data.count) 
                }
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetitions();
        }, [page, pageSize, search]); 
        

    return (
        <div className="card card-outline card-primary">
            { loading && <Loading />}
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Submitted Response</strong></h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <ListFilter 
                            search={search}
                            setSearch={setSearch}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            count={count}
                        />
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
                            { petitions.map((item, index) => (
                                <tr key={index}>
                                    <td>{ index + 1 }</td>
                                        <td>
                                        <span className="d-block">
                                            {item.petition?.reg_type?.type_name && item.petition?.reg_number && item.petition?.reg_year ? (
                                                <span className="text-success">
                                                    <strong>
                                                        {`(${item.petition.reg_type.type_name}/${item.petition.reg_number}/${item.petition.reg_year})`}
                                                    </strong>
                                                </span>
                                            ) : null}
                                        </span>
                                        <Link 
                                            to="/police/response/detail/" 
                                            state={item.petition?.efile_number ? { efile_no: item.petition.efile_number } : undefined}
                                        >
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
                                        {item.petition?.judiciary.id === 1 ? (
                                            <span>{language === "ta" ? item.petition.seat?.seat_lname : item.petition.seat?.seat_name}</span>
                                        ) : (
                                            <React.Fragment>
                                                <span>{language === "ta" ? item.petition.court?.court_lname : item.petition.court?.court_name}</span><br />
                                                {/* <span>{language === "ta" ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name}</span><br /> */}
                                                <span>{language === "ta" ? item.petition.district?.district_lname : item.petition.district?.district_name}</span>
                                            </React.Fragment>
                                        )}
                                    </td>
                                    <td>
                                        { (!item.crime?.fir_no && !item.crime?.fir_year) ? (
                                            <span className="text-warning">
                                                FIR details not available
                                            </span>
                                        ): (
                                            `${item.crime?.fir_no }/${ item.crime?.fir_year}`
                                        )}
                                    </td>
                                    <td>
                                        { item.crime?.date_of_occurrence ? (
                                            <span>
                                                {item.crime?.date_of_occurrence}<br/>
                                                {item.crime?.place_of_occurrence}
                                            </span>
                                        ): (
                                            <span className="text-center">-----</span>
                                        )}
                                    </td>
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
        </div>
    )
}

export default ResponseSubmitted
