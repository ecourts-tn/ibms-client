import React, { useContext } from 'react'
import Form from 'react-bootstrap/Form'
import { CreateMarkup } from '../../../utils'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'


const BasicDetails = ({petition, crime}) => {
    const doNothing = () => {}
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const { judiciary, seat, establishment, state, district, court, case_type, bail_type, complaint_type, crime_registered } = petition

    return (
        <div>
            { Object.keys(petition).length > 0 && (
                <div>
                                <div className="row">
                <div className="col-md-12">
                    <Form.Group className="row mb-2">
                        <Form.Label className="col-sm-3">{t('court_type')}</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                value={ language === 'ta' ? judiciary?.judiciary_lname : judiciary?.judiciary_name }
                                readOnly={true}
                                ></Form.Control>
                        </div>
                    </Form.Group>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    { judiciary?.id === 1 && (
                    <div className="form-group row">
                        <label htmlFor="bench_type" className="col-sm-3">{t('hc_bench')}</label>
                        <div className="col-sm-9">
                            <Form.Control
                                value={ language === 'ta' ? seat?.seat_lname || '' : seat?.seat_name || '' }
                                readOnly={true}
                                ></Form.Control>
                        </div>
                    </div>
                    )}
                </div>
            </div>  
            { judiciary?.id === 2 && (
                <div className="row mb-0">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="state">{t('state')}</label>
                        <Form.Control
                            value={ language === 'ta' ? state.state_lname : state.state_name }
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="district">{t('district')}</label>
                        <Form.Control
                            value={ language === 'ta' ?  district.district_lname : district.district_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="establishment">{t('est_name')}</label>
                        <Form.Control
                            value={ language === 'ta' ? establishment.establishment_lname : establishment.establishment_name}
                            readOnly={true}
                        >
                        </Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="court">{t('court')}</label>
                        <Form.Control
                            value={ language === 'ta' ? court.court_lname : court.court_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
            </div>
            )}
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="caseType">{t('case_type')}</label>
                            <Form.Control
                                value={ language === 'ta' ? case_type?.type_lfull_form : case_type?.type_full_form}
                                readOnly={true}
                            ></Form.Control>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="bailType">{t('bail_type')}</label>
                            <Form.Control
                                value={ language === 'ta' ? bail_type?.type_lname : bail_type?.type_name}
                                readOnly={true}
                            ></Form.Control>
                    </div>
                </div>
                <div className="col-md-4">
                    <Form.Group>
                        <Form.Label>{t('complaint_type')}</Form.Label>
                            <Form.Control
                                value={ language === 'ta' ? complaint_type?.type_lname : complaint_type?.type_name}
                                readOnly={true}
                            ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-sm-12">
                    <div className="form-group clearfix">
                    <label htmlFor="" className="mr-2">{t('crime_registered')}</label>
                    <div className="icheck-success d-inline mx-2">
                        <input type="radio" id="radioPrimary1" name="crime_registered" checked={ crime_registered === "1" ? true : false} onChange={doNothing}/>
                        <label htmlFor="radioPrimary1">{t('yes')}</label>
                    </div>
                    <div className="icheck-danger d-inline mx-2">
                        <input type="radio" id="radioPrimary2" name="crime_registered" checked={ crime_registered === "2" ? true : false} onChange={doNothing}/>
                        <label htmlFor="radioPrimary2">{t('no')}</label>
                    </div>
                    <div className="icheck-primary d-inline mx-2">
                        <input type="radio" id="radioPrimary3" name="crime_registered" checked={ crime_registered === "3" ? true : false} onChange={doNothing}/>
                        <label htmlFor="radioPrimary3">{t('not_known')}</label>
                    </div>
                    </div>
                </div>
                <div className="col-md-12">

                </div>
            </div>   
                </div>
            )}

        </div>
    )
}

export default BasicDetails
