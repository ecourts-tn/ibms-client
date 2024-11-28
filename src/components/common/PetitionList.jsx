import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const PetitionList = ({cases}) => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    return (
        <div className="card" style={{minHeight:'500px'}}>
            <div className="card-header">
                <h3 className="card-title">
                    <i className="ion ion-clipboard mr-1" />
                    <strong>{t('my_petition')}</strong>
                </h3>
            </div>
            <div className="card-body" style={{height:"650px", overflowY:"scroll"}}>
                <ul className="todo-list">
                    { cases.map((c, index) => (
                        <li key={index} className="mb-2">               
                            <Link to="/filing/detail" state={{efile_no:c.petition.efile_number}}>{ c.petition.efile_number }</Link><br/>
                            <span className="text mr-3">
                                { c.litigants.filter((l) => parseInt(l.litigant_type) ===1 ).map((l, index) => (
                                    <span className="text ml-2" key={index}>{index+1}. {l.litigant_name}</span>
                                ))
                                }Deenadayalan
                                <span className="text text-danger">Vs</span>
                                 State of Tamil Nadu rep by Inspector of Police
                                { c.litigants.filter((l) => parseInt(l.litigant_type) ===2 ).map((l, index) => (
                                    <span className="text ml-2" key={index}>
                                        {index+1}. {l.litigant_name} { language === 'ta' ? l.designation?.designation_lname : l.designation?.designation_name }
                                    </span>
                                ))
                                }
                            </span>
                            <div className="float-right">
                                {/* <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small> */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PetitionList