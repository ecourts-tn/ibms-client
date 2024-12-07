import React, { useContext } from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import api from '../../api'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { formatDate } from 'utils'



const ResponsePending = () => {

    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

    const[petitions, setPetitions] = useState([])

    useEffect(() => {
        async function fetchPetitions() {
          const response = await api.get("prosecution/response/pending/");
          setPetitions(response.data)
        }
        fetchPetitions();
    }, []); 

    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Pending Remarks</strong></h3>
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
                                            <th>Accused Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { petitions.map((item, index) => (
                                        <tr key={index}>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                <Link to="/prosecution/remark/create/" state={{efile_no:item.petition.efile_number}}>
                                                    <strong>{ item.petition.efile_number }</strong>
                                                </Link>
                                                <span style={{display:"block"}}>{t('efile_date')}: {formatDate(item.petition.efile_date)}</span>
                                            </td>
                                            <td>
                                                <span>{ language === 'ta' ? item.petition.court?.court_lname : item.petition.court?.court_name }</span><br />
                                                <span>{ language === 'ta' ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name }</span><br/>
                                                <span>{ language === 'ta' ? item.petition.district?.district_lname : item.petition.district?.district_name }</span>
                                            </td>
                                            <td>{ item.crime.fir_number }/{ item.crime.fir_year }</td>
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

export default ResponsePending