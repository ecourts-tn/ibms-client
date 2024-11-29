import api from 'api'
import React, { useContext } from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { formatDate } from 'utils'
import Loading from 'components/Loading'


const ConditionList = () => {

    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[petitions, setPetitions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchPetitions() {
            try{
                setLoading(true)
                const response = await api.get("police/response/pending/");
                if(response.status === 200){
                    setPetitions(response.data)
                }
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetitions();
        }, []); 

    return (
        <>
            { loading && <Loading />}
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Condition List</strong></h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <table className="table table-bordered table-striped">
                                    <thead className="bg-secondary">
                                        <tr>
                                            <th>{t('sl_no')}</th>
                                            <th>{t('efile_number')}</th>
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
                                                <Link to="/police/condition/create/" state={{efile_no:item.petition.efile_number}}>
                                                    <strong>{ item.petition.efile_number }</strong>
                                                </Link>
                                                <span style={{display:"block"}}>{t('efile_date')}: {formatDate(item.petition.efile_date)}</span>
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
                        </div>
                    </div>
                </div>  
            </div>          
        </>
    )
}

export default ConditionList
