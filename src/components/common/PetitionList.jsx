import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const PetitionList = ({cases, title, url}) => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    return (
        <div className="card" style={{minHeight:'500px'}}>
            <div className="card-header bg-secondary">
                <h3 className="card-title">
                    <i className="ion ion-clipboard mr-1" />
                    <strong>{title}</strong>
                </h3>
            </div>
            <div className="card-body p-1" style={{height:"650px", overflowY:"scroll"}}>
                { cases.map((c, index) => (
                    <div key={index} style={{background:"#f2f3f4", padding:"10px", margin:"5px 3px"}}>               
                        <Link to={url} state={{efile_no:c.petition.efile_number}}><strong>{ c.petition.efile_number }</strong></Link>
                        <div>
                            { c.litigants.filter((l) => parseInt(l.litigant_type) ===1 ).map((l, index) => (
                                <span key={index}>{index+1}. {l.litigant_name}</span>
                            ))
                            }
                            <span className="text-danger mx-2">Vs</span>
                            { c.litigants.filter((l) => parseInt(l.litigant_type) ===2 ).map((l, index) => (
                                <span key={index}>
                                    {index+1}. {l.litigant_name} { language === 'ta' ? l.designation?.designation_lname : l.designation?.designation_name }
                                </span>
                            ))
                            }
                        </div>
                        <div className="float-right">
                            {/* <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PetitionList