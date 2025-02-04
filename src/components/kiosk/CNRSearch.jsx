import React, { useContext } from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Loading from 'components/common/Loading'
import { LanguageContext } from 'contexts/LanguageContex'

const CNRSearch = () => {
    const[cino, setCino] = useState(null)
    const[petition, setPetition] = useState({})
    const [errors, setErrors] = useState({})
    const {t} = useTranslation()
    const[loading, setLoading] = useState(false)
    const[isExist, setIsExist] = useState(false)
    const {language} = useContext(LanguageContext)

    const validationSchema = Yup.object({
        cino: Yup.string().required(t('errors.cnr_required'))
    })


    const handleSubmit = async() => {
        try{
            // await  validationSchema.validate(cino, {abortEarly:false})
            setLoading(true)
            const response = await api.post("case/search/cnr-number/", {cino})
            if(response.status === 200){
                setIsExist(true)
                setPetition(response.data)
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
                                    <td>{petition.petition.efile_number}</td>
                                    <td>{t('efile_date')}</td>
                                    <td>{petition.petition.efile_date}</td>
                                </tr>
                                { petition.petition.judiciary.id== 2 && (
                                <>
                                <tr>
                                    <td>{t('state')}</td>
                                    <td>{ language === 'ta' ? petition.petition.state.state_lname : petition.petition.state.state_name }</td>
                                    <td>{t('district')}</td>
                                    <td>{ language === 'ta' ? petition.petition.district.district_lname : petition.petition.district.district_name }</td>
                                </tr>
                                <tr>
                                    <td>{t('establishment')}</td>
                                    <td>{ language === 'ta' ? petition.petition.establishment.establishment_lname : petition.petition.establishment.establishment_name }</td>
                                    <td>{t('court')}</td>
                                    <td>{ language === 'ta' ? petition.petition.court.court_lname : petition.petition.court.court_name }</td>
                                </tr>
                                </>
                                )}
                                {  petition.petition.judiciary.id === 1 && (
                                <>
                                    <tr>
                                        <td>Court Type</td>
                                        <td>{ language === 'ta' ? petition.petition.judiciary.judiciary_lname : petition.petition.judiciary.judiciary_name}</td>
                                        <td>High Court Bench</td>
                                        <td>{ language === 'ta' ? petition.petition.seat?.seat_lname : petition.petition.seat?.seat_name}</td>
                                    </tr>
                                </>
                                )}
                                <tr>
                                    <td>{t('filing_number')}</td>
                                    <td>{ petition.petition.filing_type ? `${petition.petition.filing_type.type_name}/${petition.petition.filing_number}/${petition.petition.filing_year}` : null}</td>
                                    <td>{t('filing_date')}</td>
                                    <td>{ petition.petition.filing_date }</td>
                                </tr>
                                <tr>
                                    <td>{t('case_number')}</td>
                                    <td>{ petition.petition.reg_type ? `${petition.petition.reg_type.type_name}/${ petition.petition.reg_number}/${ petition.petition.reg_year}` : null }</td>
                                    <td>{t('registration_date')}</td>
                                    <td>{  petition.petition.registration_date }</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('petitioner_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        { petition.litigant.filter((l) =>l.litigant_type ===1).map((p, index) => (
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
                                    { petition.litigant.filter((l)=>l.litigant_type===2).map((res, index) => (
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
                    </React.Fragment>
                )}
            </div>
        </>
  )
}

export default CNRSearch