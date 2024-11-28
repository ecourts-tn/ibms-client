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
                <div className="card-tools">
                    <ul className="pagination pagination-sm">
                    <li className="page-item"><a href="#/" className="page-link">«</a></li>
                    <li className="page-item"><a href="#/" className="page-link">1</a></li>
                    <li className="page-item"><a href="#/" className="page-link">2</a></li>
                    <li className="page-item"><a href="#/" className="page-link">3</a></li>
                    <li className="page-item"><a href="#/" className="page-link">»</a></li>
                    </ul>
                </div>
            </div>
            <div className="card-body">
                <ul className="todo-list" data-widget="todo-list">
                    { cases.map((c, index) => (
                        <li key={index}>
                            <span className="handle">
                                <i className="fas fa-ellipsis-v" />
                                <i className="fas fa-ellipsis-v" />
                            </span>
                            <div className="icheck-primary d-inline ml-2">
                                <input type="checkbox" name={`todo${index}`} id={`todoCheck${index}`} />
                                <label htmlFor="todoCheck1" />
                                <Link to="/filing/detail" state={{efile_no:c.petition.efile_number}}>{ c.petition.efile_number }</Link><br/>
                            </div>
                            
                            <span className="text mr-3">
                                { c.litigants.filter((l) => parseInt(l.litigant_type) ===1 ).map((l, index) => (
                                    <span className="text ml-2" key={index}>{index+1}. {l.litigant_name}</span>
                                ))
                                }
                                <span className="text text-danger">Vs</span>
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