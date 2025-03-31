import React, { useContext } from 'react'
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import api from '../../api'
import { toast, ToastContainer } from 'react-toastify';
import { CreateMarkup } from '../../utils';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const ResponseDetails = () => {
    const {state} = useLocation()
    const[petition, setPetition] = useState({
        filing_type: {}
    })
    const[crime, setCrime] = useState({})
    const[accused, setAccused] = useState([])
    const[response, setResponse] = useState([])
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const initialState = {
        cino                : '',
        offences            : '',
        date_of_arrest      : '',
        accused_name        : '',
        specific_allegations: '',
        materials_used      : '',
        discharged          : false,
        hospital_name       : '',
        victim_condition    : '',
        injury_particulars  : '',
        investigation_stage : '',
        cnr_number          : '',
        court               : '',
        case_stage          : '',
        next_hearing        : '',
        no_of_witness       : '',
        previous_case       : '',
        previous_bail       : '',
        other_accused_status: '',
        reason_not_given    : '',
        other_information   : '',
        court_details       : ''
    }
    
    const[form, setForm] = useState(initialState)

    useEffect(() => {
        async function fetchData(){
            const response = await api.post(`police/response/detail/`, {efile_no:state.efile_no})
            if(response.status === 200){
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_no
                })
                setPetition(response.data.petition)
                setAccused(response.data.litigant)
                setResponse(response.data.response)
                setCrime(response.data.crime)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await api.post("police/response/create/", form)
            if(response.status === 201){
                toast.success("Response added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
    <>
        <ToastContainer />
        <div className="content-wrapper">
        <div className="container-fluid mt-3">
            <div className="card card-outline card-primary">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Police Response</strong></h3>
                </div>
                <div className="card-body">
                    <div className="card card-outline card-warning">
                        <div className="card-header">
                            <strong>Petition Details</strong>
                        </div>
                        <div className="card-body p-1">
                        <table className="table table-bordered table-striped table-sm">
                            <tbody>
                                <tr>
                                    <td>Petition&nbsp;Number</td>
                                    <td>
                                        { (petition.filing_type && petition.filing_number && petition.filing_year) ? (
                                            <strong>
                                                {`${petition.filing_type?.type_name}/${petition.filing_number}/${petition.filing_year}`}
                                            </strong>
                                        ):(
                                            null
                                        )}
                                        
                                    </td>
                                    <td>{t('court_type')}</td>
                                    <td>{ language === 'ta' ? petition.judiciary?.judiciary_lname : petition.judiciary?.judiciary_name}</td>
                                </tr>
                                { (parseInt(petition.judiciary?.id) === 2 || parseInt(petition.judiciary?.id) === 3) && (
                                    <React.Fragment>
                                        <tr>
                                            <td>{t('state')}</td>
                                            <td>{ language === 'ta' ? petition.state?.state_lname : petition.state?.state_name}</td>
                                            <td>{t('district')}</td>
                                            <td>{ language === 'ta' ? petition.district?.district_lname : petition.district?.district_name }</td>
                                        </tr>
                                        <tr>
                                            <td>{t('establishment')}</td>
                                            <td>{ language === 'ta' ? petition.establishment?.establishment_lname : petition.establishment?.establishment_name}</td>
                                            <td>{t('court')}</td>
                                            <td>{ language === 'ta' ? petition.court?.court_lname : petition.court?.court_name }</td>
                                        </tr>
                                    </React.Fragment>
                                )}
                                { !crime?.fir_no > 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <strong className="text-danger">FIR details not available</strong>
                                        </td>
                                    </tr>
                                ):(
                                    <React.Fragment>
                                        <tr> 
                                            <td>Crime&nbsp;Number</td>
                                            <td>{`${crime?.fir_no }/${ crime?.fir_year}`}</td>
                                            <td>{t('fir_date_time')}</td>
                                            <td>{crime.fir_date_time}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('police_station')}</td>
                                            <td>{petition.police_station ? petition.police_station.station_name : null}</td>
                                            <td>{t('date_of_occurence')}</td>
                                            <td>{crime.date_of_occurrence}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('act')}</td>
                                            <td>{crime.act}</td>
                                            <td>{t('section')}</td>
                                            <td>{crime.section.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('complaintant_name')}</td>
                                            <td>{ crime.complainant_name }</td>
                                            <td>{t('place_of_occurence')}</td>
                                            <td>{ crime.place_of_occurrence }</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>
                                                <p>
                                                    <strong>{t('gist_of_fir')}</strong><br /><br />
                                                    <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>
                                                <p>
                                                    <strong>{t('gist_in_local')}</strong><br /><br />
                                                    <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir_in_local)}></span>
                                                </p>
                                            </td>
                                        </tr>
                                    </React.Fragment>    
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="card card-outline card-secondary">
                        <div className="card-header">
                            <strong>Accused Details</strong>
                        </div>
                        <div className="card-body p-1">
                            {accused.filter((l) => l.litigant_type === 1)
                                .map((a, index) => (
                                <div class="card mb-3 border-info">
                                    <div class="row no-gutters">
                                    <div class="col-md-2 d-flex justify-content-center pt-2">
                                        <img src={`${process.env.PUBLIC_URL}/images/profile.jpg`} alt="" style={{width:"120px", height:"120px"}}/>
                                    </div>
                                    <div class="col-md-10">
                                        <div class="card-body">
                                        <h5 class="card-title"><strong>{a.litigant_name}</strong>{` ${a.age}, ${a.gender}`}</h5>
                                        <p class="card-text">{`${a.relation} Name: ${a.relation_name}`}</p>
                                        <p class="card-text">{ a.address }</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card card-outline card-danger">
                        <div className="card-header">
                            <strong>Response</strong>
                        </div>
                        <div className="card-body">
                            { response.map((r, index) => (
                            <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    <tr>
                                        <td>Offences</td>
                                        <td>{r.offences}</td>
                                    </tr>
                                    <tr>
                                        <td>Date of Arrest</td>
                                        <td>{ r.date_of_arrest }</td>
                                    </tr>
                                    <tr>
                                        <td>Name of the accused/suspected person(s)</td>
                                        <td>{r.accused_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Specific Allegations /Overt Acts against the Petitioner(s)</td>
                                        <td>{ r.specific_allegations}</td>
                                    </tr>
                                    <tr>
                                        <td>Materials & Circumstances against the Petitioner</td>
                                        <td>{ r.materials_used}</td>
                                    </tr>
                                    <tr>
                                        <td>Injured discharged</td>
                                        <td>{r.discharged}</td>
                                    </tr>
                                    <tr>
                                        <td>Hospital Name</td>
                                        <td>{r.hospital_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Condition of Victim</td>
                                        <td>{r.victim_condition}</td>
                                    </tr>
                                    <tr>
                                        <td>Particulars of Injury</td>
                                        <td>{r.injury_particulars}</td>
                                    </tr>
                                    <tr>
                                        <td>Stage of Investigation / Trial</td>
                                        <td>{r.investigation_stage}</td>
                                    </tr>
                                    <tr>
                                        <td>CNR Number</td>
                                        <td>{r.cnr_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Court</td>
                                        <td>{r.court}</td>
                                    </tr>
                                    <tr>
                                        <td>Stage of the Case</td>
                                        <td>{r.case_stage}</td>
                                    </tr>
                                    <tr>
                                        <td>Next Hearing Date</td>
                                        <td>{ r.next_hearing }</td>
                                    </tr>
                                    <tr>
                                        <td>No. Of. Witness</td>
                                        <td>{ r.no_of_witness }</td>
                                    </tr>
                                    <tr>
                                        <td>Antecedents/Previous Cases against the Petitioner(s)</td>
                                        <td>{ r.previous_case }</td>
                                    </tr>
                                    <tr>
                                        <td>Details of Previous Bail Applications</td>
                                        <td>{ r.previous_bail}</td>
                                    </tr>
                                    <tr>
                                        <td>Status of other accused</td>
                                        <td>{ r.other_accused_status }</td>
                                    </tr>
                                    <tr>
                                        <td>Why Bail/AB Should Not be Granted</td>
                                        <td>{ r.reason_not_given }</td>
                                    </tr>
                                    <tr>
                                        <td>Any other Information</td>
                                        <td>{ r.other_information }</td>
                                    </tr>
                                    <tr>
                                        <td>Court Details: FIR/ Committal/Trial/ Appellate</td>
                                        <td>{ r.court_details }</td>
                                    </tr>
                                </tbody>
                            </table>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        </div>          
    </>
  )
}

export default ResponseDetails