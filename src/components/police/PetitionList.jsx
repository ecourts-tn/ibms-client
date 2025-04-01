import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'utils'
import { useTranslation } from 'react-i18next'

const PetitionList = ({petitions, setEfileNumber}) => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

    const handleProceed = async(efileNumber) => {
        // e.preventDefault()
        setEfileNumber(efileNumber)
    }

    return (
        <table className="table table-bordered table-striped mt-3">
            <thead className="bg-secondary">
                <tr>
                    <th>{t('sl_no')}</th>
                    <th>{t('Case Number or efile_number')}</th>
                    <th>{t('court')}</th>
                    <th>Crime Number/Year</th>
                    <th>Accused</th>
                    <th>Action</th>
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
                            to="/police/response/create/" 
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
                            <>
                            <span>{language === "ta" ? item.petition.court?.court_lname : item.petition.court?.court_name}</span><br />
                            {/* <span>{language === "ta" ? item.petition.establishment?.establishment_lname : item.petition.establishment?.establishment_name}</span><br /> */}
                            <span>{language === "ta" ? item.petition.district?.district_lname : item.petition.district?.district_name}</span>
                            </>
                        )}
                    </td>
                    <td>{`${item.petition?.fir_number }/${ item.petition?.fir_year}`}</td>
                    <td>
                        { item.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                            <span className="text ml-2" style={{display:'block'}} key={index}>{index+1}. {l.litigant_name}</span>
                        ))}
                    </td>
                    <td>
                        <button 
                            className="btn btn-info btn-sm"
                            onClick={(e) => handleProceed(item.petition.efile_number)}
                        >Proceed</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default PetitionList