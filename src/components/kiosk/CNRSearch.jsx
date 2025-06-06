import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Loading from 'components/utils/Loading'
import { LanguageContext } from 'contexts/LanguageContex'
import { formatDate, truncateChars } from 'utils'

const CNRSearch = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[cino, setCino] = useState(null)
    const[petition, setPetition] = useState({})
    const[litigants, setLitigants] = useState([])
    const[objections, setObjections] = useState([])
    const[proceedings, setProceedings] = useState([])
    const[errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const[isExist, setIsExist] = useState(false)

    const validationSchema = Yup.object({
        cino: Yup.string().required(t('errors.cnr_required'))
    })


    const handleSubmit = async() => {
        try{
            // await  validationSchema.validate(cino, {abortEarly:false})
            setLoading(true)
            const response = await api.post("case/search/cnr-number/", {cino})
            if(response.status === 200){
                const { petition, litigants, objections, proceedings } = response.data
                setIsExist(true)
                setPetition(petition)
                setLitigants(litigants)
                setObjections(objections)
                setProceedings(proceedings)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            if(error.response){
                toast.error(error.response.data.message, {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            { loading && <Loading />}
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('case_status')}</li>
                                <li className="breadcrumb-item active">{t('cnr_number')}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8">
                                <FormControl fullWidth>
                                    <TextField
                                        name="cino"
                                        label={t('cnr_number')}
                                        value={cino}
                                        size="small"
                                        onChange={(e) => setCino(e.target.value)}
                                        error={ errors.cino ? true : false }
                                        helperText={ errors.cino }
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-4">
                                <Button 
                                    variant='contained'
                                    color="primary"
                                    endIcon={<SearchIcon />}
                                    onClick={handleSubmit}
                                >
                                    {t('search')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                { isExist && (
                    <React.Fragment>
                        <table className="table table-bordered table-striped table-sm mt-5">
                            <tbody>
                                <tr>
                                    <td>{t('efile_number')}</td>
                                    <td>{petition.efile_number}</td>
                                    <td>{t('efile_date')}</td>
                                    <td>{petition.efile_date}</td>
                                </tr>
                                { petition.judiciary.id== 2 && (
                                <>
                                <tr>
                                    <td>{t('state')}</td>
                                    <td>{ language === 'ta' ? petition.state.state_lname : petition.state.state_name }</td>
                                    <td>{t('district')}</td>
                                    <td>{ language === 'ta' ? petition.district.district_lname : petition.district.district_name }</td>
                                </tr>
                                <tr>
                                    <td>{t('establishment')}</td>
                                    <td>{ language === 'ta' ? petition.establishment.establishment_lname : petition.establishment.establishment_name }</td>
                                    <td>{t('court')}</td>
                                    <td>{ language === 'ta' ? petition.court.court_lname : petition.court.court_name }</td>
                                </tr>
                                </>
                                )}
                                {  petition.judiciary.id === 1 && (
                                <>
                                    <tr>
                                        <td>Court Type</td>
                                        <td>{ language === 'ta' ? petition.judiciary.judiciary_lname : petition.judiciary.judiciary_name}</td>
                                        <td>High Court Bench</td>
                                        <td>{ language === 'ta' ? petition.seat?.seat_lname : petition.seat?.seat_name}</td>
                                    </tr>
                                </>
                                )}
                                <tr>
                                    <td>{t('filing_number')}</td>
                                    <td>{ petition.filing_type ? `${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}` : null}</td>
                                    <td>{t('filing_date')}</td>
                                    <td>{ petition.filing_date }</td>
                                </tr>
                                <tr>
                                    <td>{t('case_number')}</td>
                                    <td>{ petition.reg_type ? `${petition.reg_type.type_name}/${ petition.reg_number}/${ petition.reg_year}` : null }</td>
                                    <td>{t('registration_date')}</td>
                                    <td>{  petition.registration_date }</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('petitioner_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        { litigants.filter((l) =>l.litigant_type ===1).map((p, index) => (
                                            <p key={index}>
                                                <strong>{index+1}. {p.litigant_name}</strong><br/>
                                                { p.address }
                                            </p>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('respondent_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                    { litigants.filter((l)=>l.litigant_type===2).map((res, index) => (
                                        <React.Fragment>
                                            <p key={index}>
                                                <strong>{index+1}. {res.litigant_name} { language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</strong><br/>
                                                { ` ${res.address}, ${ language === 'ta' ? res.police_station?.station_lname : res.police_station?.station_name}, 
                                                    ${ language === 'ta' ? res.district?.district_lname : res.district?.district_name}, 
                                                `}
                                            </p>
                                        </React.Fragment>
                                    ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        { Object.keys(objections).length > 0 && (
                        <React.Fragment>
                            <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                            <table className="table table-bordered table-striped">
                                <thead className='bg-secondary'>
                                    <tr>
                                        <th>#</th>
                                        <th>Objection Date</th>
                                        <th>Remarks</th>
                                        <th>Complaince Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { objections.map((o, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{o.objection_date}</td>
                                        <td>{o.remarks}</td>
                                        <td>{o.complaince_date}</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                        </React.Fragment>
                        )}
                        { Object.keys(proceedings).length > 0 && (
                        <React.Fragment>
                            <h6 className="text-center text-danger"><strong>Daily Proceedings</strong></h6>
                            <table className="table table-bordered table-striped table-sm">
                                <thead className='bg-info'>
                                    <tr>
                                        <th>#</th>
                                        <th>Business Date</th>
                                        <th>Business</th>
                                        <th>Next Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { proceedings.map((p, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>
                                            <Link to={`/proceeding/detail/`} state={{cino:p.cino, proceeding_id:p.proceeding_id}}>{ formatDate(p.order_date) }</Link>
                                        </td>
                                        <td>{ truncateChars(p.order_remarks, 100)}</td>
                                        <td>{ formatDate(p.next_date) }</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                        </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        </>
  )
}

export default CNRSearch